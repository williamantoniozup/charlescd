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

import styled, { css } from "styled-components";
import FormComponent from "core/components/Form";
import PopoverComponent from "core/components/Popover";
import ButtonComponent from "core/components/Button";
import IconComponent from "core/components/Icon";
import Text from "core/components/Text";

const Title = styled(Text.h2)`
  display: flex;
  align-items: center;

  > :last-child {
    margin-left: 10px;
  }
`;

const Subtitle = styled(Text.h5)`
  margin: 20px 0;
`;

const NoMarginSubtitle = styled(Text.h5)`
  margin: -10px 0 0 0;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  margin-left: 8px;
`;

const Form = styled.form``;

const Input = styled(FormComponent.Input)`
  width: 271px;
  margin-bottom: 12px;
`;

const Number = styled(FormComponent.Number)`
  width: 271px;
  margin-bottom: 12px;
`;

const FieldPopover = styled.div`
  position: relative;
  width: 271px;
`;

const Popover = styled(PopoverComponent)`
  position: absolute;
  bottom: 1px;
  right: -25px;
`;

const Button = styled(ButtonComponent.Default)`
  margin-top: 20px;
`;

const Icon = styled(IconComponent)`
  margin-bottom: 30px;
`;

const ComponentsColumnWrapper = styled.div`
  display: flex;
  position: relative;
  margin-bottom: 20px;
  flex-direction: column;
`;

const ComponentsRowWrapper = styled.div`
  display: flex;
  position: relative;
  margin-bottom: 20px;
`;

const ComponentInput = styled(FormComponent.Input)`
  width: 155px;
  margin-right: 20px;
`;

const ComponentNumber = styled(FormComponent.Number)`
  width: 155px;
  margin-right: 20px;
`;

const ComponentTrash = styled(IconComponent)`
  position: absolute;
  bottom: 5px;
  left: -20px;
`;

const ComponentButton = styled(ButtonComponent.Default)`
  display: flex;
  align-items: center;
  border: 2px solid ${({ theme }) => theme.button.default.outline.border};
  color: ${({ theme }) => theme.button.default.outline.color};
  box-sizing: content-box;
  background: none;
  margin-bottom: 40px;

  > i {
    margin-right: 5px;
  }
`;

const FullscreenButton = styled(ButtonComponent.Default)`
  margin-bottom: -30px;
  margin-top: 10px;
  z-index: ${({ theme }) => theme.zIndex.OVER_4};
  width: 30px;
  height: 30px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: none;
`;

interface EditingWrappers {
  isNotEditing: boolean;
}

const ComponentFormWrapper = styled("div")<EditingWrappers>`
  margin-top: 20px;
  display: ${({ isNotEditing }) => (isNotEditing ? "none" : "initial")};
`;

const ComponentCardWrapper = styled("div")<EditingWrappers>`
  margin-top: 20px;
  display: ${({ isNotEditing }) => (isNotEditing ? "none" : "initial")};
`;

interface YamlWrappers {
  fullScreen: boolean;
}

const YamlEditorWrapper = styled("div")<YamlWrappers>`
  ${({ fullScreen }) =>
    fullScreen
      ? css`
          position: fixed;
          z-index: ${({ theme }) => theme.zIndex.OVER_4};
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        `
      : css`
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          margin-top: 20px;
          height: 400px;
        `}
`;

export default {
  Content,
  Title,
  Subtitle,
  NoMarginSubtitle,
  Form,
  Input,
  Number,
  FieldPopover,
  Popover,
  Icon,
  Button,
  Editor: {
    FullscreenButton,
    YamlEditorWrapper
  },
  Components: {
    ColumnWrapper: ComponentsColumnWrapper,
    Input: ComponentInput,
    Number: ComponentNumber,
    Button: ComponentButton,
    Trash: ComponentTrash,
    RowWrapper: ComponentsRowWrapper,
    FormWrapper: ComponentFormWrapper,
    CardWrapper: ComponentCardWrapper
  }
};
