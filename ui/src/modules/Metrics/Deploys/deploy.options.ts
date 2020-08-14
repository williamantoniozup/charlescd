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

import { getTheme } from 'core/utils/themes';

const theme = getTheme();

export default {
  vAxis: {
    gridlines: {
      color: theme.metrics.dashboard.chart.line,
      count: -1
    },
    minorGridlines: {
      color: 'transparent'
    },
    baseline: {
      color: theme.metrics.dashboard.chart.line
    },
    textStyle: {
      color: theme.metrics.dashboard.chart.label
    },
    viewWindow: { min: 0 }
  },
  hAxis: {
    viewWindowMode: 'explicit',
    textStyle: {
      color: theme.metrics.dashboard.chart.line
    }
  },
  series: {
    0: {
      type: 'bars',
      targetAxisIndex: 0,
      color: theme.metrics.dashboard.chart.deploy
    },
    1: {
      type: 'bars',
      targetAxisIndex: 0,
      color: theme.metrics.dashboard.chart.error
    },
    2: {
      type: 'line',
      targetAxisIndex: 1,
      lineWidth: 4,
      pointSize: 10,
      color: theme.metrics.dashboard.chart.averageTime
    }
  },
  backgroundColor: 'transparent',
  chartArea: { width: '90%', height: '70%' },
  bar: { groupWidth: '80%' },
  curveType: 'function',
  legend: 'none',
  tooltip: { 
    isHtml: true,
    showColorCode: true,
    ignoreBounds: true
  },
  selectionMode: 'multiple',
  aggregationTarget: 'none'
};
