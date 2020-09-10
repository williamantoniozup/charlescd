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
import userEvent from '@testing-library/user-event';
import { render, fireEvent, screen, waitFor } from 'unit-test/testUtils';
import { FetchMock } from 'jest-fetch-mock';
import ChangePassword from '../ChangePassword';

test('check if button is disabled', async () => {
  render(<ChangePassword />);

  const button = await screen.findByTestId('button-default-change-password');

  expect(button).toBeInTheDocument();
  expect(button).toBeDisabled();
});

test('render error in invalid field', async () => {
  render(<ChangePassword />);

  const newPassword = screen.getByTestId('input-password-newPassword');
  const confirmPassword = screen.getByTestId('input-password-confirmPassword');

  expect(newPassword).toBeInTheDocument();

  fireEvent.blur(newPassword);
  fireEvent.blur(confirmPassword);
  
  const errorNewPasswordElement =  await screen.findByTestId('error-newPassword');
  const errorConfirmPasswordElement =  await screen.findByTestId('error-confirmPassword');
  
  expect(errorNewPasswordElement).toBeInTheDocument();
  expect(errorConfirmPasswordElement).toBeInTheDocument();
});

test('submit password change form', async () => {
  // (fetch as FetchMock).mockResponseOnce(JSON.stringify({}));
  // const onSubmit = jest.fn();
  // const { queryByTestId } = render(<ChangePassword onSubmit={onSubmit} />);
  // const oldPassword = queryByTestId('input-password-oldPassword');
  // const newPassword = queryByTestId('input-password-newPassword');
  // const confirmPassword = queryByTestId('input-password-confirmPassword');
  // const value = '@Asdfg1234';

  // expect(newPassword).toBeInTheDocument();
  // fireEvent.change(oldPassword, { target: { value }});
  // fireEvent.change(newPassword, { target: { value }});
  // fireEvent.change(confirmPassword, { target: { value }});

  // screen.debug()
  // fireEvent.blur(confirmPassword);
  // const button = screen.getByTestId('button-default-change-password');
  // expect(button).not.toBeDisabled();
  // fireEvent.click(button);
  
  // await waitFor(() => expect(onSubmit).toBeCalled());
});