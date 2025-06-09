import { render, screen } from '@testing-library/react';
import { CustomCard } from '../components/Card';

it('renders image and text', () => {
  render(<CustomCard imgSrc="img.jpg" title="Title" description="Desc" />);
  expect(screen.getByAltText(/card image/i)).toBeInTheDocument();
  expect(screen.getByText('Title')).toBeInTheDocument();
  expect(screen.getByText('Desc')).toBeInTheDocument();
});
