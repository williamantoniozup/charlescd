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

import React from 'react';
import { render, fireEvent, screen } from 'unit-test/testUtils';
import Metrics from '..';

test('render Metrics default', async () => {
  render(<Metrics />);

  expect(screen.getByTestId("page")).toBeInTheDocument();
  expect(screen.getByTestId("page-menu")).toBeInTheDocument();
})

test('render Metrics deploy dashboard', async () => {
  render(<Metrics />);

  const deployDashboard = screen.getByText("Deploys");
  fireEvent.click(deployDashboard);

  expect(await screen.findByTestId("metrics-deploy")).toBeInTheDocument();
})

test('render Metrics circles dashboard', async () => {
  render(<Metrics />);

  const circleDashboard = screen.getByText("Circles");
  fireEvent.click(circleDashboard);

  expect(await screen.findByTestId("metrics-circles")).toBeInTheDocument();
})

