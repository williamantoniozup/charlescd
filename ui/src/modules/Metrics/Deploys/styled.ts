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

import styled from 'styled-components';
import ComponentButton from 'core/components/Button';
import SelectComponent from 'core/components/Form/Select';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 61px 0 80px 37px;
  > * + * {
    margin-top: 20px;
  }
`;

interface Card {
  height?: string;
  width?: string;
}

const Card = styled.div<Card>`
  background: ${({ theme }) => theme.metrics.dashboard.card};
  height: ${({ height }) => height || '94px'};
  width: ${({ width }) => width || '175px'};
  padding: 16px 25px;
  border-radius: 4px;
  box-sizing: border-box;
  position: relative;

  div.google-visualization-tooltip {
    background: rgb(28, 28, 30, 0.7) !important;
    border: none !important;
    box-shadow: none !important;

    > ul > li > span {
      color: #98989E !important;
    }
`;

const ChartHeader = styled.div``;

const StyledSelect = `
  width: 200px;
  padding-right: 30px;
  div:first-child {
    background: transparent;
  }
`;

const SingleSelect = styled(SelectComponent.Single)`
  ${StyledSelect}
`;

const MultiSelect = styled(SelectComponent.MultiCheck)`
  ${StyledSelect}
`;

const Button = styled(ComponentButton.Default)`
  border-radius: 30px;
  margin-top: 10px;
`;

const FilterForm = styled.form`
  display: flex;
  justify-content: space-around;
`;

const ChartControls = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ChartMenu = styled.div`
  position: absolute;
  top: 15px;
  right: 50px;
  z-index: 999;
`;

interface Dot {
  status: string;
}

const Dot = styled.div<Dot>`
  height: 15px;
  width: 15px;
  background-color: ${({ theme, status }) =>
    theme.metrics.dashboard.chart[status]};
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
`;

const ChartTitle = styled.div`
  span {
    margin-bottom: 5px;
  }
`;

const ChartLengend = styled.div`
  display: flex;
  padding-top: 10px;

  span {
    margin-right: 15px;
  }
`;

export default {
  Content,
  Card,
  SingleSelect,
  MultiSelect,
  Button,
  FilterForm,
  ChartControls,
  ChartMenu,
  ChartHeader,
  ChartLengend,
  ChartTitle,
  Dot
};
