import {
  Backdrop,
  Fade,
  Box,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  Typography,
  StepContent,
} from '@mui/material';
import {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import jwtDecode from 'jwt-decode';

import '../Product.scss';
import {
  useUserContext,
  useAccessToken,
  useSelectStoreMutation,
  useToastContext,
  useSearchStores,
} from '@/hooks';
import { RSAutocomplete, RSButton, RSInput, RSForm } from '@/components/RS';
import { IErrorResponse, ISuccessResponse } from '@/services/api/interfaces';
import { SelectStoreResponse } from '@/services/auth/interfaces/authResponse.interface';
import { GetStoresResponse } from '@/services/store/interfaces/getStoresReponse.interface';

type ProductModalProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

function ProductModal({ open, setOpen }: ProductModalProps) {
  // Hooks
  const { user, setUser } = useUserContext();
  const { accessToken, setAccessToken } = useAccessToken();
  const { toast } = useToastContext();
  const { t } = useTranslation('translation');
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  // States
  const [activeStep, setActiveStep] = useState(0);

  // Data
  const steps = [t('Product.Modal.Step1'), t('Product.Modal.Step2')];

  // Methods
  /**
   * Called when clicked outside of the modal
   */
  const handleClose = () => {
    setOpen(false);
  };

  /**
   * Go to next step
   */
  const handleNext = () => {
    if (activeStep < 1) {
      return setActiveStep((prev) => prev + 1);
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        className="product--modal"
        sx={{
          width: '100%',
        }}
      >
        <Fade in={open}>
          <Box className="product--modal-container">
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label} completed={activeStep > index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <RSInput
              label={t('Home.Email')}
              name="searchedProduct"
              className="home--login-input"
              control={control}
              errors={errors}
            />
            <div className="product--modal-footer">
              <RSButton
                color="inherit"
                disabled={activeStep === 0}
                onClick={() => setActiveStep((prev) => prev - 1)}
              >
                Back
              </RSButton>
              <RSButton onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </RSButton>
            </div>
          </Box>
        </Fade>
      </Dialog>
    </div>
  );
}

export default ProductModal;
