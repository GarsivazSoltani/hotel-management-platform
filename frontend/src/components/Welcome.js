import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const Welcome = () => {
  return (
    <Container>
      <Row className="mt-5">
        <Col>
          <h1>خوش آمدید به پروژه مدیریت آشپزخانه هتل</h1>
          <Button variant="primary">دکمه نمونه</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Welcome;
