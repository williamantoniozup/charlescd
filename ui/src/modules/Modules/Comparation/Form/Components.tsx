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

import React, {useState} from 'react';
import { ArrayField, FieldElement, ValidationOptions } from 'react-hook-form';
import Icon from 'core/components/Icon';
import { Component } from 'modules/Circles/interfaces/Circle';
import { component, radios, codeYaml } from './constants';
import Styled from './styled';
import RadioGroup from 'core/components/RadioGroup';
import YamlEditor from './Editor';

interface Props {
  fieldArray: {
    prepend: (value: Partial<ArrayField> | Partial<ArrayField>[]) => void;
    append: (value: Partial<ArrayField> | Partial<ArrayField>[]) => void;
    remove: (index?: number | number[] | undefined) => void;
    fields: Partial<ArrayField>;
  };
  register: <Element extends FieldElement = FieldElement>(
    validationOptions: ValidationOptions
  ) => (ref: Element | null) => void;
}

const Components = ({ fieldArray, register }: Props) => {
  const { fields, append, remove } = fieldArray;
  const [editingHelm, setEditingHelm] = useState(false)
  const one = 1;

  return (
    <>
      <Styled.Subtitle color="dark">
        Add components, enter SLO metrics and configure the HELM template:
      </Styled.Subtitle>
      <Styled.NoMarginSubtitle color="dark" fontStyle="italic">
        (The name of the component must be identical to the name of the image generated in your registry)
      </Styled.NoMarginSubtitle>
      {fields.map((field: Component, index: number) => (
        <Styled.Components.ColumnWrapper key={field.id}>
          <Styled.Components.RowWrapper>
            {fields.length > one && (
              <Styled.Components.Trash
                name="trash"
                size="15px"
                color="light"
                onClick={() => remove(index)}
              />
            )}
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
            name="helm_modes"
            items={radios}
            onChange={({ currentTarget }) => {
              console.log(currentTarget)
            }}
          />
          <YamlEditor />
          <Styled.Button size="SMALL">
            OK
          </Styled.Button>
        </Styled.Components.ColumnWrapper>
      ))}
      <Styled.Components.Button
        size="EXTRA_SMALL"
        onClick={() => append(component)}
      >
        <Icon name="add" size="15px" />
        Add component
      </Styled.Components.Button>
    </>
  );
};

export default Components;
