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
import {
  RefetchOptions,
  RefetchQueryFilters,
  QueryObserverResult,
} from '@tanstack/react-query';

import '../Supplier.scss';
import {
  useAccessToken,
  useToastContext,
  useCreateMutation,
  useSearchSuppliers,
} from '@/hooks';
import { RSButton, RSInput, RSForm } from '@/components/RS';
import { IErrorResponse, ISuccessResponse } from '@/services/api/interfaces';
import SupplierModalContent from './SupplierModalContent';
import { SupplierDto, SupplierDtoPayload } from '@/models/supplier';
import { SupplierFormValues } from '../SupplierForm';

type SupplierModalProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<
    QueryObserverResult<
      | ISuccessResponse<SupplierDto[]>
      | IErrorResponse<SupplierDto[] | undefined>,
      unknown
    >
  >;
};

export type SearchSupplierFormValues = {
  searchedSupplier: string;
};

function SupplierModal({ open, setOpen, refetch }: SupplierModalProps) {
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
  } = useForm<SearchSupplierFormValues>({
    defaultValues: {
      searchedSupplier: '',
    },
  });
  const addSupplierFormMethods = useForm<SupplierFormValues>({
    defaultValues: {
      name: '',
      phoneNumber: '',
      address: '',
      postcode: '',
      city: '',
      siren: '',
      siret: '',
      contact: '',
    },
  });
  const { searchedSupplier } = watch();
  const addSupplierPayload = addSupplierFormMethods.watch();

  // States
  const [activeStep, setActiveStep] = useState(0);
  const [enableSearchSupplier, setEnableSearchSupplier] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [supplier, setSupplier] = useState<SupplierDto>();

  // Queries
  const { isFetching } = useSearchSuppliers(
    searchedSupplier,
    enableSearchSupplier,
    accessToken,
    (response) => {
      const { ok, status, data } = response;
      setEnableSearchSupplier(false);

      if ([401, 403].includes(status)) {
        throw new Response('', { status });
      }

      if (status === 404) {
        return setNotFound(true);
      }

      if (!ok) {
        const error = response as IErrorResponse<SupplierDto>;
        toast[error.formatted.type](
          error.formatted.errorDefault,
          error.formatted.title,
          t(`Common.Supplier`),
        );
        return;
      }

      setSupplier(data);
    },
  );

  const addSupplierMutation = useCreateMutation<
    SupplierDtoPayload,
    SupplierDto
  >(
    {
      toCreate: {
        body: {
          ...addSupplierPayload,
          pictureUrl: supplier?.pictureUrl || '',
        },
      },
    },
    'supplier',
    accessToken,
  );

  // Data
  const steps = [t('Supplier.Modal.Step1'), t('Supplier.Modal.Step2')];

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
      setSupplier(undefined);
      setValue('searchedSupplier', '');
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
      addSupplierFormMethods.handleSubmit(handleAddSupplier)();
    }
  };

  /**
   * Search for supplier on backend api
   */
  const handleSearchSupplier = () => {
    setEnableSearchSupplier(true);
    setNotFound(false);
    setSupplier(undefined);
  };

  /**
   * Handle search input change
   */
  const handleInputChange = (e: SyntheticEvent) => {
    setNotFound(false);
    setValue('searchedSupplier', (e.target as HTMLInputElement).value.trim());
  };

  /**
   * Post supplier to backend API
   */
  const handleAddSupplier = () => {
    addSupplierMutation.mutate(undefined, {
      onSuccess: (response) => {
        const { ok, status } = response;

        if ([401, 403].includes(status)) {
          throw new Response('', { status });
        }

        if (!ok) {
          const addSupplierError = response as IErrorResponse<SupplierDto>;
          toast[addSupplierError.formatted.type](
            addSupplierError.formatted.errorDefault,
            addSupplierError.formatted.title,
            t(`Common.Supplier`),
          );
          return;
        }
        toast.success(
          'Supplier.Form.Success_Add',
          'Supplier.Form.Success_Add_Title',
        );
        addSupplierFormMethods.reset();
        handleClose();
        setSupplier(undefined);
        setValue('searchedSupplier', '');
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
        className="supplier--modal"
        sx={{
          width: '100%',
        }}
      >
        <Fade in={open}>
          <Box className="supplier--modal-container">
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label} completed={activeStep > index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Box className="supplier--modal-main">
              {activeStep === 0 && (
                <RSForm
                  className="supplier--modal-search"
                  onSubmit={handleSubmit(handleSearchSupplier)}
                >
                  <RSInput
                    className="supplier--modal-search-input"
                    label={t('Supplier.Modal.SearchSupplier')}
                    name="searchedSupplier"
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
              <Box className="supplier--modal-content">
                <FormProvider {...addSupplierFormMethods}>
                  <SupplierModalContent
                    activeStep={activeStep}
                    notFound={notFound}
                    searchedSupplier={searchedSupplier}
                    supplier={supplier}
                    isFetching={isFetching}
                  />
                </FormProvider>
              </Box>
            </Box>
            <div className="supplier--modal-footer">
              <RSButton color="inherit" onClick={handleBack}>
                {activeStep === 0
                  ? t('Supplier.Modal.Cancel')
                  : t('Supplier.Modal.Back')}
              </RSButton>
              <RSButton
                color={supplier ? 'primary' : 'inherit'}
                disabled={!supplier}
                onClick={handleNext}
              >
                {activeStep === steps.length - 1
                  ? t('Supplier.Form.Save')
                  : t('Supplier.Modal.Next')}
              </RSButton>
            </div>
          </Box>
        </Fade>
      </Dialog>
    </div>
  );
}

export default SupplierModal;
