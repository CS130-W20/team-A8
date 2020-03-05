import React from 'react';
import { Form, Button, Input } from 'antd';

class AddInfoForm extends React.Component {
    handleAdditionalInfoOk = async (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.setAddInfo(values);
            }
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form name='addInfo-form' onSubmit={this.handleAdditionalInfoOk}>
                <Form.Item label='Username'>
                    {getFieldDecorator('username', {
                        rules: [{required: true, message: 'Please input your username'}],
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item label='Address Line 1'>
                    {getFieldDecorator('addr1', {
                        rules: [{required: true, message: 'Please input an Address'}],
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item label='Address Line 2'>
                    {getFieldDecorator('addr2', {
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item label='City'>
                    {getFieldDecorator('city', {
                        rules: [{required: true, message: 'Please input a city'}],
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item label='State'>
                    {getFieldDecorator('state', {
                        rules: [{required: true, message: 'Please input a state'}],
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item label='Zip Code'>
                    {getFieldDecorator('zip', {
                        rules: [{required: true, message: 'Please input a zip code'}],
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item label='Bio'>
                    {getFieldDecorator('bio', {
                        rules: [{required: true, message: 'Please write a short description about yourself'}]
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type='primary' htmlType='submit'>Ok</Button>
                </Form.Item>
            </Form>
        )
    }
}

const WrappedForm = Form.create({ name: 'addInfoForm' })(AddInfoForm);
export default WrappedForm;