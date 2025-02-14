import React from 'react'
import { Modal, Button, Form, Select } from 'antd'
import { ProductListCategory } from '@renderer/redux/store/slices/cashierSlice'
import { CategoryValue } from '@renderer/presentation/entity/categoryValue.entity'

const { Option } = Select

interface ItemDetailProps {
  isVisible: boolean
  productListCategory: ProductListCategory[]
  onCancel: () => void
  onSubmit: (values: Record<string, CategoryValue>) => void
}

interface CategoryValues {
  [categoryName: string]: CategoryValue
}

const ChooseCategory: React.FC<ItemDetailProps> = ({
  isVisible,
  productListCategory,
  onCancel,
  onSubmit
}) => {
  const [form] = Form.useForm()

  const handleFinish = (values: CategoryValues) => {
    const selectedCategories = productListCategory.reduce((acc, category) => {
      acc[category.categoryName] = values[category.categoryName]
      return acc
    }, {})
    // console.log('cek selected', selectedCategories)
    onSubmit(selectedCategories)
    form.resetFields()
  }

  return (
    <Modal
      open={isVisible}
      title="Choose Bundle Items"
      footer={null}
      onCancel={onCancel}
      centered
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        {productListCategory.map((category, index) => (
          <Form.Item
            key={index}
            name={category.categoryName} // Use unique name for each category
            label={category.categoryName}
            rules={[
              { required: true, message: `Please select an item for ${category.categoryName}!` }
            ]}
          >
            <Select placeholder="Select an item">
              {category.listCategory.map((item) => (
                <Option key={item.code} value={JSON.stringify(item)}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            onClick={onCancel}
            style={{
              backgroundColor: '#D7EFEF',
              borderColor: 'transparent',
              color: '#106C6B',
              borderRadius: 8,
              height: 40
            }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              backgroundColor: '#106C6B',
              borderColor: 'transparent',
              color: '#FFF',
              borderRadius: 8,
              height: 40
            }}
          >
            Submit
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

export default ChooseCategory
