import React, { useState, useEffect } from 'react';
import { Table, Tag, Rate, Card, Spin, message } from 'antd';
import axios from 'axios';

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'trackingId',
      key: 'trackingId',
      render: (id) => <Tag color="blue">#{id}</Tag>,
    },
    {
      title: 'Delivery Date',
      dataIndex: 'deliveryDate',
      key: 'deliveryDate',
      render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A',
    },
    {
      title: 'Rating',
      dataIndex: ['feedback', 'rating'],
      key: 'rating',
      render: (rating) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: 'Category',
      dataIndex: ['feedback', 'category'],
      key: 'category',
      render: (category) => (
        <Tag color={categoryColors[category] || 'geekblue'}>
          {category || 'general'}
        </Tag>
      ),
    },
    {
      title: 'Comment',
      dataIndex: ['feedback', 'comment'],
      key: 'comment',
      render: (comment) => comment || 'No comment',
    },
    {
      title: 'Feedback Date',
      dataIndex: ['feedback', 'date'],
      key: 'feedbackDate',
      render: (date) => date ? new Date(date).toLocaleString() : 'N/A',
    },
  ];

  const categoryColors = {
    general: 'purple',
    driver: 'green',
    speed: 'volcano',
    packaging: 'orange',
    communication: 'cyan',
    app: 'gold',
  };

  const fetchUserBatch = async (emails) => {
    if (!emails || emails.length === 0) return [];
    
    try {
      const response = await axios.post('http://localhost:5000/api/user/batch', 
        { emails },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching user batch:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchFeedbacks = async () => {
      let feedbacksData = [];
      
      try {
        setLoading(true);
        
        const feedbacksRes = await axios.get('http://localhost:5000/api/feedback/all');
        feedbacksData = feedbacksRes.data;
        
        const customerEmails = [...new Set(feedbacksData.map(f => f.email))];
        const driverEmails = [...new Set(feedbacksData
          .filter(f => f.driver?.email)
          .map(f => f.driver.email))];
        
        const [customersData, driversData] = await Promise.all([
          fetchUserBatch(customerEmails),
          fetchUserBatch(driverEmails)
        ]);
        
        const customerMap = customersData.reduce((acc, user) => {
          acc[user.email] = user;
          return acc;
        }, {});
        
        const driverMap = driversData.reduce((acc, user) => {
          acc[user.email] = user;
          return acc;
        }, {});
        
        const enhancedFeedbacks = feedbacksData.map(feedback => ({
          ...feedback,
          customerName: customerMap[feedback.email]?.name || 'Unknown Customer',
          driver: {
            ...feedback.driver,
            name: feedback.driver?.email 
              ? (driverMap[feedback.driver.email]?.name || feedback.driver.name) 
              : 'Unassigned',
            phone: feedback.driver?.phone || 
              (feedback.driver?.email ? driverMap[feedback.driver.email]?.mobile : 'N/A')
          }
        }));
        
        setFeedbacks(enhancedFeedbacks);
      } catch (error) {
        console.error('Feedback fetch error:', error);
        message.error('Failed to load feedbacks. Showing basic data.');
        if (feedbacksData.length > 0) {
          setFeedbacks(feedbacksData);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <Card title="Customer Feedback" variant="outlined">
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={feedbacks}
          rowKey="trackingId"
          pagination={pagination}
          onChange={(newPagination) => setPagination(newPagination)}
        />
      </Spin>
    </Card>
  );
};

export default FeedbackPage;