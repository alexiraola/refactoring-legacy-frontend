import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import * as React from "react";

test('renders learn react link', () => {
  render(<div>some</div>);
  const element = screen.getByText(/some/i);
  expect(element).toBeInTheDocument();
});
