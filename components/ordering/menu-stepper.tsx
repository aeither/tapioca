import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Step from "@mui/material/Step";
import StepContent from "@mui/material/StepContent";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import * as React from "react";
import {
  FormContainer,
  RadioButtonGroup,
  useForm,
  useWatch,
} from "react-hook-form-mui";
import LastStepContent from "./last-step-content";
import { ProductCardProps } from "./product-card";

export type FormProps = {
  name: string;
  price: number;
  drink: string;
  sauce: string;
  dressing: string;
};

interface HamburgerSauce {
  id: string;
  label: string;
}

const SAUCES: HamburgerSauce[] = [
  { id: "ketchup", label: "Ketchup" },
  { id: "mayonnaise", label: "Mayonnaise" },
  { id: "mustard", label: "Mustard" },
  { id: "barbecue", label: "Barbecue" },
  { id: "ranch", label: "Ranch" },
  { id: "thousand island", label: "Thousand Island" },
];

interface Dressing {
  id: string;
  label: string;
}

const DRESSINGS: Dressing[] = [
  { id: "ranch", label: "Ranch" },
  { id: "italian", label: "Italian" },
  { id: "caesar", label: "Caesar" },
  { id: "honey mustard", label: "Honey Mustard" },
  { id: "balsamic vinaigrette", label: "Balsamic Vinaigrette" },
  { id: "thousand island", label: "Thousand Island" },
];

interface Drink {
  id: string;
  label: string;
}

const DRINKS: Drink[] = [
  { id: "water", label: "Water" },
  { id: "soda", label: "Soda" },
  { id: "juice", label: "Juice" },
  { id: "lemonade", label: "Lemonade" },
  { id: "iced-tea", label: "Iced Tea" },
  { id: "coca-cola", label: "Coca-Cola" },
];

const steps = [
  {
    label: "Drink",
    name: "drink",
    options: DRINKS,
  },
  {
    label: "Sauce",
    name: "sauce",
    options: SAUCES,
  },
  {
    label: "Dressing",
    name: "dressing",
    options: DRESSINGS,
  },
];

export default function MenuStepper(
  props: Omit<ProductCardProps, "handleClickOpen">,
) {
  const [activeStep, setActiveStep] = React.useState(0);
  const defaultValues: FormProps = {
    name: props.name,
    price: props.price,
    drink: "",
    sauce: "",
    dressing: "",
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const onSubmit = (data: FormProps, e: any) => {
    e?.preventDefault();

    console.log(data);
    props.handleClose();
  };

  return (
    <Box sx={{ maxWidth: 400 }}>
      <FormContainer defaultValues={defaultValues} onSuccess={onSubmit}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                optional={
                  index === 2 ? (
                    <Typography variant="caption">Last step</Typography>
                  ) : null
                }
              >
                {step.label}
              </StepLabel>
              <StepContent>
                <RadioButtonGroup
                  label={step.label}
                  name={step.name}
                  options={step.options}
                  onChange={handleNext}
                />
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === steps.length - 1 ? "Finish" : "Continue"}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3, mr: 1 }}>
            <LastStepContent handleReset={handleReset} />
          </Paper>
        )}
      </FormContainer>
    </Box>
  );
}