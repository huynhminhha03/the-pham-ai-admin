import React ,{useEffect} from "react"
import MetaTags from 'react-meta-tags';
import {
  Card,
  Row,
  Col,
  CardBody,
  CardTitle,
  Media
} from "reactstrap"

import { connect } from "react-redux";

//Import Action to copy breadcrumb items from local state to redux state
import { setBreadcrumbItems } from "../../store/actions";

const UiTypography = (props) => {
  const breadcrumbItems = [
    { title: "Lexa", link: "#" },
    { title: "UI Elements", link: "#" },
    { title: "Typography", link: "#" },
  ]

  useEffect(() => {
    props.setBreadcrumbItems('Typography', breadcrumbItems)
  })

  return (
    <React.Fragment>
      <MetaTags>
        <title>Typography | ThePhamAI - Responsive Bootstrap 5 Admin Dashboard</title>
      </MetaTags>

      <Row>
        <Col xl={6}>
          <Card>
            <CardBody>
              <Media>
                <div className="ms-3 me-4">
                  <h1 className="display-4 mb-0">A</h1>
                </div>
                <Media body className="align-self-center">
                  <p className="mb-2">Font Family</p>
                  <h5 className="mb-0">"Poppins", sans-serif</h5>
                </Media>
              </Media>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <CardTitle className="h4">Headings</CardTitle>
              <p className="card-title-desc">
                All HTML headings,{" "}
                <code className="highlighter-rouge">&lt;h1&gt;</code>{" "}
                    through{" "}
                <code className="highlighter-rouge">&lt;h6&gt;</code>, are
                    available.
                  </p>

              <h1 className="mb-3">h1. Bootstrap heading <small className="text-muted">2.03125rem (32.5px)</small></h1>

              <h2 className="mb-3">h2. Bootstrap heading <small className="text-muted">1.625rem (26px)</small></h2>

              <h3 className="mb-3">h3. Bootstrap heading <small className="text-muted">1.42188rem (22.75px)</small></h3>

              <h4 className="mb-3">h4. Bootstrap heading <small className="text-muted">1.21875rem (19.5px)</small></h4>

              <h5 className="mb-3">h5. Bootstrap heading <small className="text-muted">1.01563rem (16.25)</small></h5>

              <h6>h6. Bootstrap heading <small className="text-muted">0.8125rem (13px)</small></h6>{/*  */}
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <CardTitle className="h4">Inline text elements</CardTitle>
              <p className="card-title-desc">
                Styling for common inline HTML5 elements.
                  </p>

              <p className="lead">
                Vivamus sagittis lacus vel augue laoreet rutrum faucibus
                dolor auctor.
                  </p>
              <p>You can use the mark tag to <mark>highlight</mark> text.</p>
              <p><del>This line of text is meant to be treated as deleted text.</del></p>
              <p><s>This line of text is meant to be treated as no longer accurate.</s></p>
              <p><ins>This line of text is meant to be treated as an addition to the document.</ins></p>
              <p><u>This line of text will render as underlined</u></p>
              <p><small>This line of text is meant to be treated as fine print.</small></p>
              <p><strong>This line rendered as bold text.</strong></p>
              <p className="mb-0"><em>This line rendered as italicized text.</em></p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <CardTitle className="h4">Unstyled List</CardTitle>
              <p className="card-title-desc">
                Remove the default{" "}
                <code className="highlighter-rouge">list-style</code> and
                    left margin on list items (immediate children only).{" "}
                <strong>
                  This only applies to immediate children list items
                    </strong>
                    , meaning you will need to add the className for any nested
                    lists as well.
                  </p>

              <ul className="list-unstyled mb-0">
                <li>Integer molestie lorem at massa</li>
                <li>
                  Nulla volutpat aliquam velit
                      <ul>
                    <li>Phasellus iaculis neque</li>
                    <li>Purus sodales ultricies</li>
                    <li>Vestibulum laoreet porttitor sem</li>
                  </ul>
                </li>
                <li>Faucibus porta lacus fringilla vel</li>
              </ul>
            </CardBody>
          </Card>
        </Col>

        <Col xl={6}>
          <Card>
            <CardBody>
              <CardTitle className="h4">Display headings</CardTitle>
              <p className="card-title-desc">
                Traditional heading elements are designed to work best in
                    the meat of your page content.{" "}
              </p>

              <h1 className="display-1">Display 1</h1>
              <h1 className="display-2">Display 2</h1>
              <h1 className="display-3">Display 3</h1>
              <h1 className="display-4">Display 4</h1>
              <h1 className="display-5">Display 5</h1>
              <h1 className="display-6 mb-0">Display 6</h1>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <CardTitle className="h4">Blockquotes</CardTitle>
              <p className="card-title-desc">
                For quoting blocks of content from another source within
                    your document. Wrap{" "}
                <code className="highlighter-rouge">
                  &lt;blockquote className="blockquote"&gt;
                    </code>{" "}
                    around any{" "}
                <abbr title="HyperText Markup Language">HTML</abbr> as the
                    quote.
                  </p>

              <blockquote className="blockquote font-size-16 mb-0">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
                <footer className="blockquote-footer">Someone famous in <cite title="Source Title">Source Title</cite></footer>
              </blockquote>

              <blockquote className="blockquote  blockquote-reverse font-size-16 mb-0">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
                <footer className="blockquote-footer">Someone famous in <cite title="Source Title">Source Title</cite></footer>
              </blockquote>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <CardTitle className="h4">Inline List</CardTitle>
              <p className="card-title-desc">
                Remove a list’s bullets and apply some light{" "}
                <code className="highlighter-rouge">margin</code> with a
                    combination of two className,{" "}
                <code className="highlighter-rouge">.list-inline</code> and
                    <code className="highlighter-rouge">.list-inline-item</code>
                    .
                  </p>

              <ul className="list-inline mb-0">
                <li className="list-inline-item">Lorem ipsum</li>
                <li className="list-inline-item">Phasellus iaculis</li>
                <li className="list-inline-item">Nulla volutpat</li>
              </ul>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col className="col-12">
          <Card>
            <CardBody>
              <CardTitle className="h4">Description list alignment</CardTitle>
              <p className="card-title-desc">
                Align terms and descriptions horizontally by using our grid
                system’s predefined className (or semantic mixins). For
                    longer terms, you can optionally add a{" "}
                <code className="highlighter-rouge">.text-truncate</code>{" "}
                    className to truncate the text with an ellipsis.
                  </p>

              <dl className="row mb-0">
                <dt className="col-sm-3">Description lists</dt>
                <dd className="col-sm-9">
                  A description list is perfect for defining terms.
                    </dd>

                <dt className="col-sm-3">Euismod</dt>
                <dd className="col-sm-9">
                  Vestibulum id ligula porta felis euismod semper eget
                  lacinia odio sem nec elit.
                    </dd>
                <dd className="col-sm-9 offset-sm-3">
                  Donec id elit non mi porta gravida at eget metus.
                    </dd>

                <dt className="col-sm-3">Malesuada porta</dt>
                <dd className="col-sm-9">
                  Etiam porta sem malesuada magna mollis euismod.
                    </dd>

                <dt className="col-sm-3 text-truncate">
                  Truncated term is truncated
                    </dt>
                <dd className="col-sm-9">
                  Fusce dapibus, tellus ac cursus commodo, tortor mauris
                  condimentum nibh, ut fermentum massa justo sit amet risus.
                    </dd>

                <dt className="col-sm-3">Nesting</dt>
                <dd className="col-sm-9">
                  <dl className="row mb-0">
                    <dt className="col-sm-4">Nested definition list</dt>
                    <dd className="col-sm-8">
                      Aenean posuere, tortor sed cursus feugiat, nunc augue
                      blandit nunc.
                        </dd>
                  </dl>
                </dd>
              </dl>
            </CardBody>
          </Card>
        </Col>
      </Row>

    </React.Fragment>
  )
}

export default connect(null, { setBreadcrumbItems })(UiTypography);