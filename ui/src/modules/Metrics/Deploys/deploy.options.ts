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
  title: 'Deploy',
  titleTextStyle: {
    color: theme.metrics.dashboard.chart.label,
    fontName: 'Arial',
    fontSize: 20,
    position: 'Top',
    alignment: 'start'
  },
  backgroundColor: 'transparent',
  seriesType: 'bars',
  colors: [
    theme.metrics.dashboard.chart.deploy,
    theme.metrics.dashboard.chart.error
    // theme.metrics.dashboard.chart.averageTime,
  ],
  vAxis: {
    textStyle: { color: '#FFF' },
    gridlines: { color: '#FFF' },
    baselineColor: '#FFF'
  },
  hAxis: {
    textStyle: { color: '#FFF' }
  },
  bar: { groupWidth: '90%' },
  legend: { position: 'top', textStyle: { color: '#FFF' } },
  tooltip: { isHtml: true },
  chartArea: { width: '95%', height: '80%' }
};
