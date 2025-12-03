import { Container, Row, Col, Button, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import React, { useState } from 'react';

import AddProductFormWrapper from '../../components/AddProductFormWrapper/AddProductFormWrapper.jsx';
import UpdateAccountForm from "../../components/UpdateAccountForm/UpdateAccountForm.jsx";
import ManageProducts from "../../components/ManageProducts/ManageProducts.jsx";
import GenericNavBar from "../../components/GenericNavBar/GenericNavBar.jsx";

import './UserPage.css';

function UserPage({ onLoginClick }) {
    const { userInfo } = useSelector(state => state.user);
    const navigate = useNavigate();
    const [selectedSection, setSelectedSection] = useState('account');

    const renderContent = () => {
        switch (selectedSection) {
            case 'account':
                return <UpdateAccountForm />;
            case 'manageProducts':
                return <ManageProducts />;
            case 'addProduct':
                return <AddProductFormWrapper />;
            default:
                return null;
        }
    };

    return (
        <div className="app-container">
            <GenericNavBar
                onLoginClick={onLoginClick}
            />
            <Container fluid className="userpage-container">
                <Row className="mb-3">
                    <Col>
                        <Button variant="secondary" onClick={() => navigate('/')}>
                            Back to Main Page
                        </Button>
                    </Col>
                </Row>

                <Row>
                    <Col md={2} className="userpage-sidebar">
                        <h5>Account</h5>
                        <ListGroup>
                            <ListGroup.Item
                                active={selectedSection === 'account'}
                                onClick={() => setSelectedSection('account')}
                                className="clickable-item"
                            >
                                Update Account
                            </ListGroup.Item>

                            {userInfo?.seller && (
                                <>
                                    <ListGroup.Item
                                        active={selectedSection === 'manageProducts'}
                                        onClick={() => setSelectedSection('manageProducts')}
                                        className="clickable-item"
                                    >
                                        Manage Products
                                    </ListGroup.Item>

                                    <ListGroup.Item
                                        active={selectedSection === 'addProduct'}
                                        onClick={() => setSelectedSection('addProduct')}
                                        className="clickable-item"
                                    >
                                        Add New Product
                                    </ListGroup.Item>
                                </>
                            )}
                        </ListGroup>
                    </Col>

                    <Col md={10}>
                        <div className="userpage-content">
                            {renderContent()}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default UserPage;
