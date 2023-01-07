import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Chip,
  AccordionActions,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction, useState } from 'react';

import { RSForm, RSInput } from '@/components/RS';
import { useForm } from 'react-hook-form';
import { AisleDto } from '@/models/aisle';

type AisleItemProps = {
  aisleId: number;
  setAisleId: Dispatch<SetStateAction<number>>;
  aisle: AisleDto;
};

type AisleFormValues = {
  name: string;
  categories: number[];
};

function AisleItem({ aisleId, setAisleId, aisle }: AisleItemProps) {
  // Hooks
  const { t } = useTranslation('translation');
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AisleFormValues>({
    defaultValues: {
      name: aisle.name,
      categories: aisle.categories
        ?.map((cat) => cat.id)
        .filter((value) => !!value),
    },
  });

  // States
  const [readOnly, setReadOnly] = useState(true);

  // Methods
  /**
   * Open or close expander
   */
  const handleExpand = (id: number) => {
    if (aisleId === id) return setAisleId(0);
    setAisleId(id);
  };

  /**
   * Update aisle name
   */
  const handleUpdateAisle = () => {
    setReadOnly(!readOnly);
  };

  /**
   * Make aisle name editable
   */
  const handleEditButtonClick = () => {
    setReadOnly(!readOnly);
  };

  return (
    <Accordion
      expanded={aisleId === aisle.id}
      onChange={() => handleExpand(aisle.id || 0)}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        className="aisle--accordion-summary"
      >
        <RSForm
          onSubmit={handleSubmit(handleUpdateAisle)}
          onClick={(e) => e.stopPropagation()}
        >
          <RSInput
            className="aisle--form-input"
            hiddenLabel
            name="name"
            control={control}
            errors={errors}
            size="small"
            readOnly={readOnly}
            InputProps={{
              disableUnderline: true,
            }}
            onClick={(e) => e.stopPropagation()}
            startIcon="edit"
            onStartIconClick={handleEditButtonClick}
          />
        </RSForm>
        <Typography sx={{ color: 'text.secondary' }}>
          {`${aisle.categories?.length || 0} catégories`}
        </Typography>
      </AccordionSummary>
      <AccordionDetails className="aisle--accordion-details">
        <AccordionActions>
          <RSForm
            onSubmit={handleSubmit(handleUpdateAisle)}
            onClick={(e) => e.stopPropagation()}
          >
            <RSInput
              className="aisle--form-input"
              hiddenLabel
              name="name"
              control={control}
              errors={errors}
              size="small"
              readOnly={readOnly}
              InputProps={{
                disableUnderline: true,
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </RSForm>
        </AccordionActions>
        <div>
          {aisle.categories?.map((cat) => (
            <Chip key={cat.id} label={cat.name} color="primary" />
          ))}
        </div>
      </AccordionDetails>
    </Accordion>
  );
}

export default AisleItem;
