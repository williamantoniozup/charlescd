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

import React, { useState } from 'react';
import { useFormContext, ArrayField } from 'react-hook-form';
import { maxLength, isRequired } from 'core/utils/validations';
import { Component } from 'modules/Modules/interfaces/Component';
import Styled from './styled';

interface Props {
  remove: (index?: number | number[] | undefined) => void;
  field: Component;
  fields: Partial<ArrayField>;
  index: number;
}

const ComponentForm = ({ field, fields, index, remove }: Props) => {
  const { register, unregister, errors } = useFormContext();
  const [editMoreOptions, setEditMoreOptions] = useState(false);
  const one = 1;

  const handleMoreOptions = (index: number) => {
    if (editMoreOptions) {
      unregister(`components[${index}].hostValue`);
      unregister(`components[${index}].gatewayName`);
      return setEditMoreOptions(!editMoreOptions);
    }
    setEditMoreOptions(!editMoreOptions);
    register(`components[${index}].hostValue`, { required: true });
    register(`components[${index}].gatewayName`, { required: true });
  };

  return (
    <Styled.Components.ColumnWrapper key={field.id}>
      <Styled.Components.Wrapper>
        {fields.length > one && (
          <Styled.Components.Trash
            name="trash"
            size="15px"
            color="light"
            onClick={() => remove(index)}
          />
        )}
        <Styled.Components.Input
          label="Enter name"
          name={`components[${index}].name`}
          ref={register({ required: isRequired(), maxLength: maxLength() })}
        />
        <Styled.Components.Input
          name={`components[${index}].latencyThreshold`}
          label="Latency Threshold (ms)"
          type="number"
          ref={register({ required: isRequired() })}
        />
        <Styled.Components.Input
          name={`components[${index}].errorThreshold`}
          label="Http Error Threshold (%)"
          type="number"
          ref={register({ required: isRequired() })}
        />
      </Styled.Components.Wrapper>
      <Styled.Subtitle onClick={() => handleMoreOptions(index)} color="dark">
        {editMoreOptions ? 'Hide and clean ' : 'Show '}
        advanced options (be careful, do not change this if you are not using
        istio gateway)
      </Styled.Subtitle>
      {editMoreOptions && (
        <>
          <Styled.FieldPopover>
            <Styled.Input
              label="Insert a host for virtual service use"
              name={`components[${index}].hostValue`}
              // TO-DO
              // error={errors?.components[`${index}`]?.hostValue?.message}
              ref={register({ required: isRequired() })}
            />
            <Styled.Popover
              title="Host name"
              icon="info"
              size="20px"
              link="https://istio.io/latest/docs/reference/config/networking/virtual-service/"
              linkLabel="View documentation"
              description="In some cases it will be necessary to change the host to expose your application, by default leave it empty.."
            />
          </Styled.FieldPopover>
          <Styled.FieldPopover>
            <Styled.Input
              label="Insert a ingress name if necessary"
              name={`components[${index}].gatewayName`}
              // TO-DO
              // error={errors?.components[`${index}`]?.gatewayName?.message}
              ref={register({ required: isRequired() })}
            />
            <Styled.Popover
              title="Istio ingress"
              icon="info"
              size="20px"
              link="https://istio.io/latest/docs/reference/config/networking/gateway/"
              linkLabel="View documentation"
              description="If your application use ingress gateway to be exposed it will be necessary to link with a virtual service using ingress name"
            />
          </Styled.FieldPopover>
        </>
      )}
    </Styled.Components.ColumnWrapper>
  );
};

export default ComponentForm;
