import { Button } from 'alurkerja-ui';
import { useNavigate } from 'react-router-dom';

interface DetailFormActionButtonProps {
  onDelete?: () => void;
  canDelete?: boolean;
  isLoadingDelete?: boolean;

  hideEdit?: boolean;
}

export const DetailFormActionButton: React.FC<DetailFormActionButtonProps> = ({
  onDelete,
  canDelete = false,
  isLoadingDelete = false,
  hideEdit = false,
}) => {
  const navigate = useNavigate();
  return (
    <div className="mt-4 flex justify-between">
      <Button variant="outlined" type="button" onClick={() => navigate(-1)}>
        Back
      </Button>
      <div className="flex justify-end gap-2">
        {canDelete && (
          <Button color="red" type="button" onClick={onDelete} loading={isLoadingDelete}>
            Delete
          </Button>
        )}

        {!hideEdit && (
          <Button color="green" type="button" onClick={() => navigate('edit')}>
            Edit
          </Button>
        )}
      </div>
    </div>
  );
};
