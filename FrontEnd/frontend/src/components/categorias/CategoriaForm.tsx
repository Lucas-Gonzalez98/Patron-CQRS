import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { type CrearCategoriaCommand } from '../../types/CrearCategoriaCommand';
import { type CategoriaDTO } from '../../types/CategoriaDTO';
import { crearCategoria, actualizarCategoria } from '../../services/categoriaCommandService';

// Styled Components
const FormCard = styled(Card)`
  width: 100%;
  margin: 0 auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CharacterCount = styled.small`
  color: #6c757d;
  float: right;
`;

const InfoSection = styled(Alert)`
  margin-top: 1rem;
`;

interface CategoriaFormProps {
  categoria?: CategoriaDTO;
  onSubmit: (success: boolean) => void;
  onCancel: () => void;
}

const CategoriaForm: React.FC<CategoriaFormProps> = ({
  categoria,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<CrearCategoriaCommand>({
    nombre: '',
    descripcion: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const isEditing = !!categoria;

  useEffect(() => {
    if (categoria) {
      setFormData({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion
      });
    }
  }, [categoria]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (formData.descripcion && formData.descripcion.trim().length > 0 && formData.descripcion.trim().length < 5) {
      newErrors.descripcion = 'La descripción debe tener al menos 5 caracteres o estar vacía';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Preparar datos para envío (descripción vacía se convierte en undefined)
      const dataToSend: CrearCategoriaCommand = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion?.trim() || undefined
      };

      if (isEditing && categoria) {
        await actualizarCategoria(categoria.id, dataToSend);
      } else {
        await crearCategoria(dataToSend);
      }
      onSubmit(true);
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      onSubmit(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard>
      <Card.Header>
        <h4 className="mb-0">
          {isEditing ? 'Editar Categoría' : 'Crear Categoría'}
        </h4>
      </Card.Header>
      
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              Nombre <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              maxLength={100}
              isInvalid={!!errors.nombre}
              placeholder="Ingrese el nombre de la categoría"
            />
            <Form.Control.Feedback type="invalid">
              {errors.nombre}
            </Form.Control.Feedback>
            <CharacterCount>
              {formData.nombre.length}/100 caracteres
            </CharacterCount>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              maxLength={500}
              isInvalid={!!errors.descripcion}
              placeholder="Ingrese la descripción de la categoría (opcional)"
              style={{ resize: 'none' }}
            />
            <Form.Control.Feedback type="invalid">
              {errors.descripcion}
            </Form.Control.Feedback>
            <CharacterCount>
              {(formData.descripcion || '').length}/500 caracteres
            </CharacterCount>
          </Form.Group>

          {isEditing && categoria && (
            <InfoSection variant="light">
              <Row>
                <Col sm={6}>
                  <strong>Productos asociados:</strong> {categoria.cantidadProductos}
                </Col>
                <Col sm={6}>
                  <strong>Estado:</strong> {categoria.estado}
                </Col>
              </Row>
            </InfoSection>
          )}

          <Row className="mt-4">
            <Col>
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="w-100 mb-2"
              >
                {loading && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    className="me-2"
                  />
                )}
                {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
              </Button>
            </Col>
            <Col>
              <Button
                variant="secondary"
                onClick={onCancel}
                disabled={loading}
                className="w-100"
              >
                Cancelar
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </FormCard>
  );
};

export default CategoriaForm;