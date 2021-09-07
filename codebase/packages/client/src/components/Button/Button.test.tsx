import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent } from '@testing-library/react';
import { renderWithTheme as themeRender } from 'utils/test';

import { Button } from './Button';

describe('Button', () => {
  it('should render Button', () => {
    const { getByRole } = themeRender(<Button>Review changes</Button>);

    const button = getByRole('button');

    expect(button).toHaveTextContent('Review changes');
  });

  it('should correctly pass the event handlers down and fire them as expected', () => {
    const onPress = jest.fn();
    const onPressStart = jest.fn();
    const onPressChange = jest.fn();
    const onPressEnd = jest.fn();
    const onKeyUp = jest.fn();
    const onKeyDown = jest.fn();
    const onBlur = jest.fn();
    const onFocus = jest.fn();
    const onFocusChange = jest.fn();

    const handlers = {
      onPress,
      onPressStart,
      onPressChange,
      onPressEnd,
      onKeyUp,
      onKeyDown,
      onBlur,
      onFocus,
      onFocusChange,
    };

    const { getByRole } = themeRender(<Button {...handlers}>Button</Button>);
    const button = getByRole('button');

    fireEvent.click(button);
    fireEvent.keyDown(button);
    fireEvent.keyUp(button);
    fireEvent.blur(button);

    expect(onPress).toBeCalled();
    expect(onPressStart).toBeCalled();
    expect(onPressChange).toBeCalled();
    expect(onPressEnd).toBeCalled();
    expect(onKeyUp).toBeCalled();
    expect(onKeyDown).toBeCalled();
    expect(onBlur).toBeCalled();
    expect(onFocus).toBeCalled();
    expect(onFocusChange).toBeCalled();
  });

  it('should not allow for any of the interaction state handlers to be called when is disabled', () => {
    const onPress = jest.fn();
    const onPressStart = jest.fn();
    const onPressChange = jest.fn();
    const onPressEnd = jest.fn();
    const onKeyUp = jest.fn();
    const onKeyDown = jest.fn();
    const onBlur = jest.fn();
    const onFocus = jest.fn();
    const onFocusChange = jest.fn();

    const handlers = {
      onPress,
      onPressStart,
      onPressChange,
      onPressEnd,
      onKeyUp,
      onKeyDown,
      onBlur,
      onFocus,
      onFocusChange,
    };

    const { getByRole } = themeRender(
      <Button {...handlers} isDisabled={true}>
        Button
      </Button>,
    );
    const button = getByRole('button');

    fireEvent.click(button);
    fireEvent.keyDown(button);
    fireEvent.keyUp(button);
    fireEvent.blur(button);

    expect(onPress).not.toBeCalled();
    expect(onPressStart).not.toBeCalled();
    expect(onPressChange).not.toBeCalled();
    expect(onPressEnd).not.toBeCalled();
    expect(onKeyUp).not.toBeCalled();
    expect(onKeyDown).not.toBeCalled();
    expect(onBlur).not.toBeCalled();
    expect(onFocus).not.toBeCalled();
    expect(onFocusChange).not.toBeCalled();
  });

  it('should have aria-disabled attribute when disabled', () => {
    const { getByRole } = themeRender(<Button isDisabled={true}>Button</Button>);

    const button = getByRole('button');

    expect(button).toHaveAttribute('aria-disabled', 'true');
  });
});
