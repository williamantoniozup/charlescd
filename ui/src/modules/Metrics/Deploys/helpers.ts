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

import { DeployMetricData, PERIOD_PARAM } from './interfaces';
import dayjs from 'dayjs';

export const chartDateFormatter = (date: string) => {
  return dayjs(date, 'YYYY-MM-DD').format('DDMMM');
};

const buildSeriesData = (data: DeployMetricData, row: number) => {
  return [
    chartDateFormatter(data?.successfulDeploymentsInPeriod[row]?.period),
    data?.successfulDeploymentsInPeriod[row]?.total,
    data?.failedDeploymentsInPeriod[row]?.total,
    data?.deploymentsAverageTimeInPeriod[row]?.averageTime
  ];
};

export const getDeploySeries = (data: DeployMetricData) => {
  let newSeries: unknown[][] = [['Day', 'Deploy', 'Error', 'Avarege Time']];

  for (
    let index = 0;
    index < data?.successfulDeploymentsInPeriod.length;
    index++
  ) {
    const rowData = buildSeriesData(data, index);
    newSeries = newSeries.concat([rowData]);
  }
  return newSeries;
};

export const getLabel = (period: string) => {
  switch (period) {
    case PERIOD_PARAM.ONE_WEEK: {
      return 'One Week';
    }
    case PERIOD_PARAM.TWO_WEEKS: {
      return 'Two Week';
    }
    case PERIOD_PARAM.ONE_MONTH: {
      return 'One Month';
    }
    case PERIOD_PARAM.THREE_MONTHS: {
      return 'Tree Months';
    }
    default: {
      return '';
    }
  }
};
