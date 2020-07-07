/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useEffect, useState } from "react";
import {
  ArrayField,
  FieldElement,
  ValidationOptions,
  FormContextValues
} from "react-hook-form";
import Icon from "core/components/Icon";
import { Component } from "modules/Circles/interfaces/Circle";
import { component, radios, codeYaml } from "./constants";
import ComponentForm from "./ComponentForm";
import Styled from "./styled";

interface Props {
  fieldArray: {
    prepend: (value: Partial<ArrayField> | Partial<ArrayField>[]) => void;
    append: (value: Partial<ArrayField> | Partial<ArrayField>[]) => void;
    remove: (index?: number | number[] | undefined) => void;
    fields: Partial<ArrayField>;
  };
  register: <Element extends FieldElement = FieldElement>(
    name?: Partial<FieldElement>,
    validationOptions?: ValidationOptions
  ) => (ref: Element | null) => void;
  setValue: (name: string, value: string) => void;
  getValues: (name: string) => string;
}

const Components = ({ fieldArray, register, setValue, getValues }: Props) => {
  const { fields, append, remove } = fieldArray;
  const [finishedPreviousComponent, setFinishedPreviousComponent] = useState(false)


  return (
    <>
      <Styled.Subtitle color="dark">
        Add components, enter SLO metrics and configure the HELM template:
      </Styled.Subtitle>
      <Styled.NoMarginSubtitle color="dark" fontStyle="italic">
        (The name of the component must be identical to the name of the image
        generated in your registry)
      </Styled.NoMarginSubtitle>
      {fields.map((field: Component, index: number) => (
        <ComponentForm
          key={field.id}
          field={field}
          fields={fields}
          getValues={getValues}
          setValue={setValue}
          index={index}
          register={register}
          remove={remove}
          setFinishedPreviousComponent={setFinishedPreviousComponent}
        />
      ))}
      {finishedPreviousComponent && (
        <Styled.Components.Button
          size="EXTRA_SMALL"
          onClick={() => {
            append(component)
            setFinishedPreviousComponent(false)
          }}
        >
          <Icon name="add" size="15px" />
          Add component
        </Styled.Components.Button>
      )}
    </>
  );
};

export default Components;
