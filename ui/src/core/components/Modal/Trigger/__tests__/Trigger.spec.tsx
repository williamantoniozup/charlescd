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
import { render, screen } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import Modal from 'core/components/Modal';

test('render Trigger', () => {
  render(
    <Modal.Trigger
      title="Test"
      dismissLabel="dismiss"
      onDismiss={jest.fn()}
      onContinue={jest.fn()}
    >
      Test
    </Modal.Trigger>
  );

  const modalElement = screen.getByTestId('modal-trigger');
  const continueButton = screen.getByTestId('button-default-continue');

  expect(modalElement).toBeInTheDocument();
  expect(continueButton).toBeInTheDocument();
});

test('onDismiss button click', () => {
  const onDismiss = jest.fn();
  render(
    <Modal.Trigger title="Test" dismissLabel="dismiss" onDismiss={onDismiss}>
      Test
    </Modal.Trigger>
  );
  const dismissButton = screen.getByTestId('button-default-dismiss');
  userEvent.click(dismissButton);
  expect(onDismiss).toHaveBeenCalledTimes(1);
});

test('onContinue button click', () => {
  const onContinue = jest.fn();
  render(
    <Modal.Trigger title="Test"
      dismissLabel="dismiss"
      onDismiss={jest.fn()}
      onContinue={onContinue}
    >
      Test
    </Modal.Trigger>
  );

  const continueButton = screen.getByTestId('button-default-continue');
  userEvent.click(continueButton);

  expect(onContinue).toHaveBeenCalledTimes(1);
});

test('onClose button click', () => {
  render(
    <Modal.Trigger
      title="Test"
      dismissLabel="dismiss"
      onDismiss={jest.fn()}
      onContinue={jest.fn()}
    >
      Test
    </Modal.Trigger>
  );

  const modalElement = screen.getByTestId('modal-trigger');
  const cancelButton = screen.getByTestId('icon-cancel');
  expect(modalElement).toBeInTheDocument();

  userEvent.click(cancelButton);
  expect(modalElement).not.toBeInTheDocument();
});