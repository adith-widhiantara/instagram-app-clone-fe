import { Button } from 'alurkerja-ui';
import { useNavigate } from 'react-router-dom';
import { DefaultButton } from '../ui/button';

interface AddFormActionButtonProps {
  isLoadingSubmit?: boolean;
  canDraft?: boolean;
  onClickDraft?: () => void;
  isLoadingDraft?: boolean;
  canReject?: boolean;
  onClickReject?: () => void;
  isLoadingReject?: boolean;
  rejectLabel?: string;
  isDisabledSubmit?: boolean;
  isDisabledReject?: boolean;
  hideSubmit?: boolean;
}

export const AddFormActionButton: React.FC<AddFormActionButtonProps> = ({
  isLoadingSubmit,
  isDisabledSubmit = false,
  hideSubmit = false,

  canDraft = false,
  onClickDraft = () => {},
  isLoadingDraft = false,

  canReject = false,
  onClickReject = () => {},
  isLoadingReject = false,
  rejectLabel = 'Reject',
  isDisabledReject = false,
}) => {
  const navigate = useNavigate();
  return (
    <div className="mt-4 flex flex-row justify-between">
      <Button variant="outlined" type="button" onClick={() => navigate(-1)}>
        Back
      </Button>
      <div className="flex gap-x-1">
        {canReject && (
          <Button
            type="button"
            onClick={onClickReject}
            loading={isLoadingReject}
            color="red"
            disabled={isDisabledReject}
          >
            {rejectLabel}
          </Button>
        )}
        {canDraft && (
          <DefaultButton
            color="info"
            type="button"
            onClick={onClickDraft}
            loading={isLoadingDraft}
            className="text-nowrap"
          >
            Save as Draft
          </DefaultButton>
        )}
        {!hideSubmit && (
          <Button loading={isLoadingSubmit} disabled={isDisabledSubmit}>
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};
