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

import { render, screen } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import ButtonDefault from 'core/components/Button/ButtonDefault';

test('render Button default component', () => {
  const click = jest.fn();
  const id = 'test';
  render(
    <ButtonDefault id={id} onClick={click}>
      button
    </ButtonDefault>
  );

  const buttonDefault = screen.getByTestId(`button-default-${id}`);
  expect(buttonDefault).toBeInTheDocument();
  userEvent.click(buttonDefault);
  expect(click).toBeCalled();
});

test('render Button default in disabled mode', () => {
  const click = jest.fn();
  render(
    <ButtonDefault id="test" onClick={click} isDisabled={true}>
      button
    </ButtonDefault>
  );

  const buttonDefault = screen.getByTestId('button-default-test');
  userEvent.click(buttonDefault);
  expect(click).not.toBeCalled();
});

test('render Button default in loading mode', () => {
  render(
    <ButtonDefault id="test" isLoading={true}>
      button
    </ButtonDefault>
  );

  const buttonDefault = screen.getByTestId('button-default-test');
  const loading = buttonDefault.querySelector('svg');
  expect(loading).toBeInTheDocument();
});
