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
import { useForm } from 'react-hook-form';
import { SyntheticEvent } from 'react';

import '../Product.scss';
import { useAccessToken, useToastContext, useSearchProduct } from '@/hooks';
import { RSButton, RSInput, RSForm } from '@/components/RS';
import { IErrorResponse } from '@/services/api/interfaces';
import { ProductResponse } from '@/services/product/interfaces/productResponse.interface';
import ProductModalContent from './ProductModalContent';

type ProductModalProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

function ProductModal({ open, setOpen }: ProductModalProps) {
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
  } = useForm();
  const { searchedProduct } = watch();

  // States
  const [activeStep, setActiveStep] = useState(0);
  const [enableSearchProduct, setEnableSearchProduct] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [product, setProduct] = useState<ProductResponse>();

  // Queries
  useSearchProduct(
    searchedProduct,
    enableSearchProduct,
    accessToken,
    (response) => {
      const { ok, status, data } = response;
      setEnableSearchProduct(false);

      if ([401, 403].includes(status)) {
        throw new Response('', { status });
      }

      if (status === 404) {
        return setNotFound(true);
      }

      if (!ok) {
        const error = response as IErrorResponse<ProductResponse>;
        toast[error.formatted.type](
          error.formatted.errorDefault,
          error.formatted.title,
        );
        return;
      }

      setProduct(data);
    },
  );

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

  /**
   * Search for product on backend api
   */
  const handleSearchProduct = () => {
    setEnableSearchProduct(true);
    setNotFound(false);
    setProduct(undefined);
  };

  /**
   * Handle search input change
   */
  const handleInputChange = (e: SyntheticEvent) => {
    setNotFound(false);
    setValue('searchedProduct', (e.target as HTMLInputElement).value);
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
            <Box className="product--modal-main">
              {activeStep === 0 && (
                <RSForm
                  className="product--modal-search"
                  onSubmit={handleSubmit(handleSearchProduct)}
                >
                  <RSInput
                    className="product--modal-search-input"
                    label={t('Product.Modal.SearchProduct')}
                    name="searchedProduct"
                    control={control}
                    errors={errors}
                    endIcon="search"
                    onChange={handleInputChange}
                  />
                </RSForm>
              )}
              <Box className="product--modal-content">
                <ProductModalContent
                  activeStep={activeStep}
                  notFound={notFound}
                  searchedProduct={searchedProduct}
                  product={product}
                />
              </Box>
            </Box>
            <div className="product--modal-footer">
              <RSButton
                color="inherit"
                disabled={activeStep === 0}
                onClick={() => setActiveStep((prev) => prev - 1)}
              >
                {t('Product.Modal.Back')}
              </RSButton>
              <RSButton
                color={product ? 'primary' : 'inherit'}
                disabled={!product}
                onClick={handleNext}
              >
                {activeStep === steps.length - 1
                  ? t('Product.Modal.Add')
                  : t('Product.Modal.Next')}
              </RSButton>
            </div>
          </Box>
        </Fade>
      </Dialog>
    </div>
  );
}

export default ProductModal;
