import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Grid, Row, Col } from './Grid';

describe('Grid', () => {
  it('SHOULD render children correctly', () => {
    render(
      <Grid>
        <span>Grid content</span>
      </Grid>
    );

    expect(screen.getByText('Grid content')).toBeInTheDocument();
  });

  it('SHOULD apply the default grid class when fluid is not enabled', () => {
    const { container } = render(<Grid>Grid content</Grid>);

    expect(container.firstChild).toHaveClass('grid');
    expect(container.firstChild).not.toHaveClass('grid-fluid');
  });

  it('SHOULD apply the fluid layout class when fluid is true', () => {
    const { container } = render(<Grid fluid>Grid content</Grid>);

    expect(container.firstChild).toHaveClass('grid-fluid');
    expect(container.firstChild).not.toHaveClass('grid');
  });

  it('SHOULD merge optional props such as className and data-testid correctly', () => {
    render(
      <Grid className="custom-grid" data-testid="grid-root">
        Grid content
      </Grid>
    );

    const grid = screen.getByTestId('grid-root');
    expect(grid).toHaveClass('grid');
    expect(grid).toHaveClass('custom-grid');
  });

  it('SHOULD handle empty content safely when no children are provided', () => {
    const { container } = render(<Grid data-testid="grid-root" />);

    const grid = screen.getByTestId('grid-root');
    expect(grid).toBeEmptyDOMElement();
    expect(container.firstChild).toHaveClass('grid');
  });

  it('SHOULD forward refs to the root div element', () => {
    const ref = createRef<HTMLDivElement>();

    render(<Grid ref={ref}>Grid content</Grid>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('grid');
  });
});

// Row: single horizontal band inside a Grid; always carries the 'row' class
describe('Row', () => {
  it('SHOULD render children correctly', () => {
    render(
      <Row>
        <span>Row content</span>
      </Row>
    );

    expect(screen.getByText('Row content')).toBeInTheDocument();
  });

  it('SHOULD always apply the row class', () => {
    const { container } = render(<Row>Row content</Row>);

    expect(container.firstChild).toHaveClass('row');
  });

  it('SHOULD merge a custom className alongside the row class', () => {
    const { container } = render(<Row className="custom-row">Row content</Row>);

    expect(container.firstChild).toHaveClass('row');
    expect(container.firstChild).toHaveClass('custom-row');
  });

  it('SHOULD handle empty content safely when no children are provided', () => {
    const { container } = render(<Row />);

    expect(container.firstChild).toBeEmptyDOMElement();
    expect(container.firstChild).toHaveClass('row');
  });

  it('SHOULD forward refs to the root div element', () => {
    const ref = createRef<HTMLDivElement>();

    render(<Row ref={ref}>Row content</Row>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('row');
  });
});

// Col: responsive column inside a Row; sm is required, md/lg/xl are optional breakpoints
describe('Col', () => {
  it('SHOULD render children correctly', () => {
    render(
      <Col sm={12}>
        <span>Col content</span>
      </Col>
    );

    expect(screen.getByText('Col content')).toBeInTheDocument();
  });

  it('SHOULD always apply the col-sm class for the sm prop', () => {
    const { container } = render(<Col sm={6}>Col content</Col>);

    expect(container.firstChild).toHaveClass('col-sm-6');
  });

  it('SHOULD apply col-md class only when md is provided', () => {
    const { container: withMd } = render(
      <Col sm={12} md={6}>
        Col content
      </Col>
    );
    expect(withMd.firstChild).toHaveClass('col-sm-12');
    expect(withMd.firstChild).toHaveClass('col-md-6');

    const { container: withoutMd } = render(<Col sm={12}>Col content</Col>);
    expect(withoutMd.firstChild).not.toHaveClass('col-md-12');
  });

  it('SHOULD apply col-lg class only when lg is provided', () => {
    const { container: withLg } = render(
      <Col sm={12} lg={4}>
        Col content
      </Col>
    );
    expect(withLg.firstChild).toHaveClass('col-lg-4');

    const { container: withoutLg } = render(<Col sm={12}>Col content</Col>);
    expect(withoutLg.firstChild).not.toHaveClass('col-lg-12');
  });

  it('SHOULD apply col-xl class only when xl is provided', () => {
    const { container: withXl } = render(
      <Col sm={12} xl={3}>
        Col content
      </Col>
    );
    expect(withXl.firstChild).toHaveClass('col-xl-3');

    const { container: withoutXl } = render(<Col sm={12}>Col content</Col>);
    expect(withoutXl.firstChild).not.toHaveClass('col-xl-12');
  });

  it('SHOULD apply all breakpoint classes when all props are provided', () => {
    const { container } = render(
      <Col sm={12} md={6} lg={4} xl={3}>
        Col content
      </Col>
    );

    expect(container.firstChild).toHaveClass('col-sm-12');
    expect(container.firstChild).toHaveClass('col-md-6');
    expect(container.firstChild).toHaveClass('col-lg-4');
    expect(container.firstChild).toHaveClass('col-xl-3');
  });

  it('SHOULD merge a custom className alongside breakpoint classes', () => {
    const { container } = render(
      <Col sm={12} className="custom-col">
        Col content
      </Col>
    );

    expect(container.firstChild).toHaveClass('col-sm-12');
    expect(container.firstChild).toHaveClass('custom-col');
  });

  it('SHOULD handle empty content safely when no children are provided', () => {
    const { container } = render(<Col sm={12} />);

    expect(container.firstChild).toBeEmptyDOMElement();
    expect(container.firstChild).toHaveClass('col-sm-12');
  });

  it('SHOULD forward refs to the root div element', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Col sm={12} ref={ref}>
        Col content
      </Col>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('col-sm-12');
  });
});
