import React, { useState, useEffect } from "react";
import { FieldElement, ArrayField, ValidationOptions, useFormContext } from "react-hook-form";
import Styled from "./styled";
import YamlEditor from "./Editor";
import RadioGroup from "core/components/RadioGroup";
import { radios, component } from "./constants";
import Card from "core/components/Card";
import { Component } from "modules/Modules/interfaces/Component";
import { validFields } from "./helpers";
import { Module } from "modules/Modules/interfaces/Module";


interface Props {
  index: number;
  field: Component;
  fields: Partial<ArrayField>;
  remove: (index?: number | number[] | undefined) => void;
  setFinishedPreviousComponent: (finishedPreviousComponent: boolean) => void;
}

const ComponentForm = ({
  fields,
  field,
  index,
  remove,
  setFinishedPreviousComponent
}: Props) => {
  const { getValues, register, unregister, setValue, watch } = useFormContext()
  const one = 1;
  const watchComponent = watch(`components[${index}]`) || component
  const { templateMethod, name, latencyThreshold, errorThreshold } = watchComponent


  useEffect(() => {
    console.log('to aqui', index)
    register(
      { name: `components[${index}].templateMethod` },
      { required: true }
    );
  }, [field]);


  const handleRadioButton = (helmMethod: string) => {
    setValue(
      `components[${index}].templateMethod`,
      helmMethod,
    );
    if (helmMethod === 'guide') {
      register(
        { name: `components[${index}].yamlValues` },
        { required: true }
      );
      unregister(`components[${index}].helmLink`)
    } else {
      register(
        { name: `components[${index}].helmLink` },
        { required: true }
      );
      unregister(`components[${index}].yamlValues`)
    }
  }

  const validateModule = () => {
    const isValid = validFields(watchComponent);
    return isValid
  }

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
          onChange={({ currentTarget }) => handleRadioButton(currentTarget.value)}
        />
        {templateMethod ? (
          templateMethod === "guide" ? (
            <YamlEditor onChange={(code) => setValue(`components[${index}].yamlValues`, code)} />
          ) : (
            <Styled.Input
              label="Insert a helm repository link"
              name={`components[${index}].helmLink`}
              ref={register({ required: true })}
            />
          )
        ) : null}
        <Styled.Button
          isDisabled={!validateModule()}
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
          description={name}
          latencyThreshold={latencyThreshold}
          errorThreshold={errorThreshold}
          icon="close"
          onClick={() => setIsNotEditing(false)}
          canClose={true}
          onClose={() => {
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
