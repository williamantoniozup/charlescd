import React, { useState, useEffect } from "react";
import { FieldElement, ArrayField, ValidationOptions } from "react-hook-form";
import Styled from "./styled";
import YamlEditor from "./Editor";
import HelmInput from "./HelmInput";
import RadioGroup from "core/components/RadioGroup";
import { radios } from "./constants";
import Card from "core/components/Card";
import { Component } from "modules/Modules/interfaces/Component";

interface Props {
  index: number;
  field: Component;
  fields: Partial<ArrayField>;
  getValues: (name: string) => string;
  register: <Element extends FieldElement = FieldElement>(
    name?: Partial<FieldElement>,
    validationOptions?: ValidationOptions
  ) => (ref: Element | null) => void;
  remove: (index?: number | number[] | undefined) => void;
  setValue: (name: string, value: string) => void;
  setFinishedPreviousComponent: (finishedPreviousComponent: boolean) => void;
}

const ComponentForm = ({
  fields,
  field,
  index,
  remove,
  register,
  setValue,
  getValues,
  setFinishedPreviousComponent
}: Props) => {
  useEffect(() => {
    register(
      { name: `components[${index}].templateMethod` },
      { required: true }
    );
  }, []);

  const one = 1;
  const componentName = getValues(`components[${index}].name`);
  const componentLatency = getValues(`components[${index}].latencyThreshold`);
  const componentError = getValues(`components[${index}].errorThreshold`);
  const componentTemplateMethod = getValues(
    `components[${index}].templateMethod`
  );
  const [isNotEditing, setIsNotEditing] = useState(false);

  return (
    <Styled.Components.ColumnWrapper key={field.id}>
      <Styled.Components.FormWrapper isNotEditing={isNotEditing}>
        <Styled.Components.RowWrapper>
          <Styled.Components.Input
            label="Component Name"
            name={`components[${index}].name`}
            ref={register({ required: true })}
          />
          <Styled.Components.Number
            name={`components[${index}].latencyThreshold`}
            label="Latency Threshold (ms)"
            ref={register({ required: true })}
          />
          <Styled.Components.Number
            name={`components[${index}].errorThreshold`}
            label="Http Error Threshold (%)"
            ref={register({ required: true })}
          />
        </Styled.Components.RowWrapper>
        <RadioGroup
          name={`components[${index}].templateMethod`}
          items={radios}
          onChange={({ currentTarget }) => {
            setValue(
              `components[${index}].templateMethod`,
              currentTarget.value
            );
          }}
        />
        {componentTemplateMethod ? (
          componentTemplateMethod === "guide" ? (
            <YamlEditor />
          ) : (
            <HelmInput />
          )
        ) : null}
        <Styled.Button
          onClick={() => {
            setFinishedPreviousComponent(true);
            setIsNotEditing(true);
          }}
          size="SMALL"
        >
          OK
        </Styled.Button>
      </Styled.Components.FormWrapper>
      <Styled.Components.CardWrapper isNotEditing={!isNotEditing}>
        <Card.Component
          description={componentName}
          latencyThreshold={componentLatency}
          errorThreshold={componentError}
          icon="close"
          onClick={() => setIsNotEditing(false)}
          canClose={true}
          onClose={() => {
            console.log(fields)
            if (fields.length <= one) {
              setIsNotEditing(false);
            } else {
              remove(index);
            }
          }}
        />
      </Styled.Components.CardWrapper>
    </Styled.Components.ColumnWrapper>
  );
};

export default ComponentForm;
