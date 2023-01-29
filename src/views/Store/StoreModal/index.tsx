import {
  Backdrop,
  Fade,
  Box,
  Stepper,
  Step,
  StepLabel,
  Dialog,
} from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { SyntheticEvent } from 'react';

import '../Store.scss';
import {
  useAccessToken,
  useToastContext,
  useCreateMutation,
  useSearchStoresSiret,
} from '@/hooks';
import { RSButton, RSInput, RSForm } from '@/components/RS';
import { IErrorResponse } from '@/services/api/interfaces';
import StoreModalContent from './StoreModalContent';
import { StoreDto, StoreDtoPayload } from '@/models/store';
import { StoreFormValues } from '../StoreForm';

type StoreModalProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<
    QueryObserverResult<
      ISuccessResponse<StoreDto[]> | IErrorResponse<StoreDto[] | undefined>,
      unknown
    >
  >;
};

export type SearchStoreFormValues = {
  searchedStore: string;
};

function StoreModal({ open, setOpen, refetch }: StoreModalProps) {
  // Hooks
  const { accessToken } = useAccessToken();
  const { toast } = useToastContext();
  const { t } = useTranslation('translation');
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SearchStoreFormValues>({
    defaultValues: {
      searchedStore: '',
    },
  });
  const addStoreFormMethods = useForm<StoreFormValues>({
    defaultValues: {
      name: '',
      address: '',
      postcode: '',
      city: '',
      siren: '',
      siret: '',
    },
  });
  const { searchedStore } = watch();
  const addStorePayload = addStoreFormMethods.watch();

  // States
  const [activeStep, setActiveStep] = useState(0);
  const [enableSearchStore, setEnableSearchStore] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [store, setStore] = useState<StoreDto>();

  // Queries
  const { isFetching } = useSearchStoresSiret(
    searchedStore,
    enableSearchStore,
    accessToken,
    (response) => {
      const { ok, status, data } = response;
      setEnableSearchStore(false);

      if ([401, 403].includes(status)) {
        throw new Response('', { status });
      }

      if (status === 404) {
        return setNotFound(true);
      }

      if (!ok) {
        const error = response as IErrorResponse<StoreDto>;
        toast[error.formatted.type](
          error.formatted.errorDefault as string,
          error.formatted.title,
          t(`Common.Store`),
        );
        return;
      }

      setStore(data);
    },
  );

  const addStoreMutation = useCreateMutation<StoreDtoPayload, StoreDto>(
    {
      toCreate: {
        body: {
          ...addStorePayload,
          pictureUrl: store?.pictureUrl || '',
        },
      },
    },
    'store',
    accessToken,
  );

  // Data
  const steps = [t('Store.Modal.Step1'), t('Store.Modal.Step2')];

  // Methods
  /**
   * Called when clicked on cancel button or close icon
   */
  const handleClose = () => {
    setOpen(false);
  };

  /**
   * Go to previous step or close modal
   */
  const handleBack = () => {
    if (!activeStep) {
      setStore(undefined);
      setValue('searchedStore', '');
      return handleClose();
    }
    setActiveStep((prev) => prev - 1);
  };

  /**
   * Go to next step
   */
  const handleNext = async () => {
    if (activeStep < 1) {
      return setActiveStep((prev) => prev + 1);
    }
    if (activeStep === 1) {
      addStoreFormMethods.handleSubmit(handleAddStore)();
    }
  };

  /**
   * Search for store on backend api
   */
  const handleSearchStore = () => {
    setEnableSearchStore(true);
    setNotFound(false);
    setStore(undefined);
  };

  /**
   * Handle search input change
   */
  const handleInputChange = (e: SyntheticEvent) => {
    setNotFound(false);
    setValue('searchedStore', (e.target as HTMLInputElement).value.trim());
  };

  /**
   * Post store to backend API
   */
  const handleAddStore = () => {
    addStoreMutation.mutate(undefined, {
      onSuccess: (response) => {
        const { ok, status } = response;

        if ([401, 403].includes(status)) {
          throw new Response('', { status });
        }

        if (!ok) {
          const addStoreError = response as IErrorResponse<StoreDto>;
          toast[addStoreError.formatted.type](
            addStoreError.formatted.errorDefault,
            addStoreError.formatted.title,
            t(`Common.Store`),
          );
          return;
        }
        toast.success('Store.Form.Success_Add', 'Store.Form.Success_Add_Title');
        addStoreFormMethods.reset();
        handleClose();
        setStore(undefined);
        setValue('searchedStore', '');
        setActiveStep(0);
        refetch();
      },
    });
  };

  return (
    <div>
      <Dialog
        open={open}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        className="store--modal"
        sx={{
          width: '100%',
        }}
      >
        <Fade in={open}>
          <Box className="store--modal-container">
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label} completed={activeStep > index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Box className="store--modal-main">
              {activeStep === 0 && (
                <RSForm
                  className="store--modal-search"
                  onSubmit={handleSubmit(handleSearchStore)}
                >
                  <RSInput
                    className="store--modal-search-input"
                    label={t('Store.Modal.SearchStore')}
                    name="searchedStore"
                    control={control}
                    errors={errors}
                    endIcon="search"
                    onChange={handleInputChange}
                    inputProps={{
                      maxLength: 14,
                    }}
                  />
                </RSForm>
              )}
              <Box className="store--modal-content">
                <FormProvider {...addStoreFormMethods}>
                  <StoreModalContent
                    activeStep={activeStep}
                    notFound={notFound}
                    searchedStore={searchedStore}
                    store={store}
                    isFetching={isFetching}
                  />
                </FormProvider>
              </Box>
            </Box>
            <div className="store--modal-footer">
              <RSButton color="inherit" onClick={handleBack}>
                {activeStep === 0
                  ? t('Store.Modal.Cancel')
                  : t('Store.Modal.Back')}
              </RSButton>
              <RSButton
                color={store ? 'primary' : 'inherit'}
                disabled={!store}
                onClick={handleNext}
              >
                {activeStep === steps.length - 1
                  ? t('Store.Form.Save')
                  : t('Store.Modal.Next')}
              </RSButton>
            </div>
          </Box>
        </Fade>
      </Dialog>
    </div>
  );
}

export default StoreModal;
