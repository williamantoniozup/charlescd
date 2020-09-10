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
import { render, fireEvent, screen, waitFor } from 'unit-test/testUtils';
import UsersComparationItem from '..';
import * as PathUtils from 'core/utils/path';
import { FetchMock } from 'jest-fetch-mock/types';

const props = {
  email: 'test@zup.com.br'
};

test('render UsersComparationItem default component', async () => {
  render(
    <UsersComparationItem {...props} onChange={jest.fn} />
  );

  expect(screen.getByTestId(`users-comparation-item-${props.email}`)).toBeInTheDocument();
});

test('render Modal.Trigger on UsersComparationItem component', async () => {
  render(
    <UsersComparationItem {...props} onChange={jest.fn} />
  );

  expect(screen.getByTestId(`users-comparation-item-${props.email}`)).toBeInTheDocument();

  const buttonDropdown = await screen.findByTestId('icon-vertical-dots');
  fireEvent.click(buttonDropdown);
  expect(screen.queryByTestId('icon-delete')).toBeInTheDocument();

  fireEvent.click(screen.queryByTestId('icon-delete'));
  expect(screen.queryByTestId('modal-trigger')).toBeInTheDocument();
});

test('click on Cancel button in Modal.Trigger component', async () => {
  render(
    <UsersComparationItem {...props} onChange={jest.fn} />
  );

  expect(screen.getByTestId(`users-comparation-item-${props.email}`)).toBeInTheDocument();

  const buttonDropdown = await screen.findByTestId('icon-vertical-dots');
  fireEvent.click(buttonDropdown);
  expect(screen.queryByTestId('icon-delete')).toBeInTheDocument();

  const buttonDelete = screen.queryByTestId('icon-delete');
  fireEvent.click(buttonDelete);
  expect(screen.queryByTestId('modal-trigger')).toBeInTheDocument();
  
  const buttonCancel = screen.getByTestId('button-default-dismiss')
  fireEvent.click(buttonCancel);
  expect(screen.queryByTestId('modal-trigger')).not.toBeInTheDocument();
});

test('click on Delete button in Modal.Trigger component', async () => {
  render(
    <UsersComparationItem {...props} onChange={jest.fn} />
  );

  expect(screen.getByTestId(`users-comparation-item-${props.email}`)).toBeInTheDocument();

  const buttonDropdown = await screen.findByTestId('icon-vertical-dots');
  fireEvent.click(buttonDropdown);
  expect(screen.queryByTestId('icon-delete')).toBeInTheDocument();
  
  const buttonDelete = await screen.findByTestId('icon-delete')
  fireEvent.click(buttonDelete);
  expect(screen.queryByTestId('modal-trigger')).toBeInTheDocument();
});

test('close UsersComparationItem component', async () => {
    render(
      <UsersComparationItem {...props} onChange={jest.fn} />
    );

    const delParamSpy = spyOn(PathUtils, 'delParam');
  
    expect(screen.getByTestId(`users-comparation-item-${props.email}`)).toBeInTheDocument();

    const tabPanelCloseButton = await screen.findByTestId('icon-cancel');
    expect(tabPanelCloseButton).toBeInTheDocument();

    fireEvent.click(tabPanelCloseButton);
    
    expect(delParamSpy).toHaveBeenCalledWith('user', '/users/compare', expect.anything(), props.email);
});

test('render UsersComparationItem component and trigger ModalResetPassword', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify({ id: '123-456', password: '123457' })
  );

  render(
    <UsersComparationItem {...props} onChange={jest.fn} />
  );

  expect(screen.getByTestId(`users-comparation-item-${props.email}`)).toBeInTheDocument();

  const buttonResetPassword = await screen.findByTestId('labeledIcon-shield');
  fireEvent.click(buttonResetPassword);
  expect(screen.queryByTestId('modal-default')).toBeInTheDocument()
});
