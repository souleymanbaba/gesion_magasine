import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import './ContactUs.css'; // Assurez-vous que le chemin est correct

const ContactUs = () => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Envoyer le formulaire ici
    Swal.fire({
      icon: 'success',
      title: t('contact_success'),
    });
  };

  const directionClass = i18n.language === 'ar' ? 'rtl' : 'ltr';

  return (
    <Container className={`contact-us-container ${directionClass}`}>
      <Row className="contact-us-header">
        <Col>
          <h1>{t('contact_us_title')}</h1>
          <p>{t('contact_intro')}</p>
        </Col>
      </Row>
      <Row className="contact-us-section">
        <Col md={6}>
          <h2>{t('contact_info_title')}</h2>
          <ul>
            <li><strong>{t('contact_address')}:</strong> 123 Rue Exemple, Ville, Pays</li>
            <li><strong>{t('contact_email')}:</strong> contact@exemple.com</li>
            <li><strong>{t('contact_phone')}:</strong> +123 456 7890</li>
          </ul>
        </Col>
        <Col md={6}>
          <h2>{t('contact_form_title')}</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>{t('contact_name')}</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>{t('contact_email')}</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formMessage">
              <Form.Label>{t('contact_message')}</Form.Label>
              <Form.Control
                as="textarea"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              {t('contact_send')}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactUs;
