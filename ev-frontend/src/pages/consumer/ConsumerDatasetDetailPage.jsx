import React from 'react';
import { useParams } from 'react-router-dom';
import DatasetDetail from '../../components/data/DatasetDetail';

const ConsumerDatasetDetailPage = () => {
  const { id } = useParams();

  return (
    <div>
      <DatasetDetail datasetId={parseInt(id)} />
    </div>
  );
};

export default ConsumerDatasetDetailPage;
