import { FileRejection, useDropzone } from 'react-dropzone';
import { FieldValues, Path, useFormContext } from 'react-hook-form';
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from './form';
import { cn } from '@/utils/helpers/cn';
import { File, Trash2Icon, UploadCloudIcon, ExternalLinkIcon } from 'lucide-react';
import { Button } from 'alurkerja-ui';
import { RequiredAsterisk } from './required-asterisk';

interface ServerFile {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  status: boolean;
}

interface FieldFileDropzoneProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  label?: string;
  hideLabel?: boolean;
  description?: string;
  accept?: string;
  isDisabled?: boolean;
  isVisuallyHidden?: boolean;
  hasRequiredAsterisk?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  title?: string;
  min?: number;
  transform?: (e: React.ChangeEvent<HTMLInputElement>) => React.ChangeEvent<HTMLInputElement>;
  uppercase?: boolean;
  maxSize?: number; // in bytes
  serverFile?: ServerFile | null; // New prop for server file data
  onServerFileDelete?: (fileId: string) => void; // Optional callback when server file is "deleted" (cleared)
  showServerFileActions?: boolean; // Whether to show actions for server file
}

export default function FieldFileDropzone<TFormValues extends FieldValues>(props: FieldFileDropzoneProps<TFormValues>) {
  const {
    name,
    description,
    label,
    isDisabled: disabled,
    isVisuallyHidden,
    hideLabel,
    hasRequiredAsterisk,
    accept,
    maxSize,
    serverFile,
    onServerFileDelete,
    showServerFileActions = true,
  } = props;
  const form = useFormContext();

  const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (acceptedFiles.length > 0) {
      form.clearErrors(name);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      form.setValue(name, acceptedFiles[0] as any);
    }

    fileRejections.forEach(fileRejection => {
      fileRejection.errors.forEach(error => {
        if (error.code === 'file-too-large') {
          form.setError(name, {
            type: 'manual',
            message: 'File is too large. Maximum size is ' + (maxSize ? maxSize / 1024 / 1024 : 0) + 'MB',
          });
        }
        if (error.code === 'file-invalid-type') {
          form.setError(name, {
            type: 'manual',
            message: generateErrorMessage(accept),
          });
        }
      });
    });
  };

  const handleDeleteFile = (e: React.MouseEvent) => {
    form.resetField(name);
    // @ts-expect-error clear the value
    form.setValue(name, undefined);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    e.stopPropagation();
  };

  const handleDeleteServerFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Just clear the form field - no attachment will be sent on submit
    form.resetField(name);
    // @ts-expect-error clear the value
    form.setValue(name, undefined);

    // Optional callback if parent needs to know about the deletion
    if (serverFile?.id && onServerFileDelete) {
      onServerFileDelete(serverFile.id);
    }
  };

  const handleDownloadFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (serverFile?.file_url) {
      window.open(serverFile.file_url, '_blank');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateAcceptObject(accept),
    maxSize: maxSize,
  });

  const supportedFormatsText = generateSupportedFormatsText(accept);

  // Check if we have a newly uploaded file
  const hasUploadedFile = form.watch(name) && Object.keys(form.watch(name)).length > 0;

  // Check if we have a server file
  const hasServerFile = serverFile && serverFile.file_name;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={`${isVisuallyHidden ? 'sr-only' : 'break-inside-avoid-column'}${hideLabel ? ' space-y-0' : ''}`}
        >
          {label && <FormLabel className={hideLabel ? 'sr-only' : ''}>{label}</FormLabel>}
          {hasRequiredAsterisk && <RequiredAsterisk />}

          <div
            {...getRootProps()}
            className={
              'border-black rounded-lg border border-dashed p-4' + (disabled ? ' cursor-not-allowed opacity-50' : '')
            }
            data-testid="dropzone-root"
          >
            <input {...getInputProps()} data-testid="dropzone-input" disabled={disabled} />

            {/* Display newly uploaded file */}
            {hasUploadedFile && field?.value ? (
              <div className={cn('flex flex-col flex-wrap items-center')}>
                <div className="w-1/3 min-w-[220px] rounded-lg border shadow">
                  <div className="flex items-center justify-center p-6">
                    <File size={48} />
                  </div>
                  <div className="flex w-full flex-row flex-nowrap border-t p-2">
                    <div className="flex w-[calc(100%-36px)] flex-1 items-center">
                      <p className="truncate text-ellipsis break-all text-sm">{field.value.name}</p>
                    </div>
                    <div className="w-9 flex-none">
                      <Button
                        type="button"
                        variant="text"
                        size="small"
                        className="cursor-pointer text-red-500 hover:text-red-700"
                        data-testid={`deleteButtonFile-${name}`}
                        onClick={handleDeleteFile}
                      >
                        <Trash2Icon size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : /* Display server file if no uploaded file */
            hasServerFile ? (
              <div className={cn('flex flex-col flex-wrap items-center')}>
                <div className="w-1/3 min-w-[220px] rounded-lg border bg-blue-50 shadow">
                  <div className="flex items-center justify-center p-6">
                    <File size={48} className="text-blue-600" />
                  </div>
                  <div className="flex w-full flex-row flex-nowrap border-t p-2">
                    <div className="flex w-[calc(100%-72px)] flex-1 items-center">
                      <div className="flex flex-col">
                        <p className="truncate text-ellipsis break-all text-sm font-medium">{serverFile.file_name}</p>
                        <p className="text-xs text-gray-500">From server</p>
                      </div>
                    </div>
                    {showServerFileActions && (
                      <div className="w-18 flex flex-none gap-1">
                        <Button
                          type="button"
                          variant="text"
                          size="small"
                          className="cursor-pointer text-blue-500 hover:text-blue-700"
                          data-testid={`downloadButtonFile-${name}`}
                          onClick={handleDownloadFile}
                          title="Download/View file"
                        >
                          <ExternalLinkIcon size={16} />
                        </Button>
                        {onServerFileDelete && (
                          <Button
                            type="button"
                            variant="text"
                            size="small"
                            className="cursor-pointer text-red-500 hover:text-red-700"
                            data-testid={`deleteServerButtonFile-${name}`}
                            onClick={handleDeleteServerFile}
                            title="Delete file"
                          >
                            <Trash2Icon size={16} />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Empty state - show upload area */
              <div className={cn('flex flex-col items-center space-y-4')}>
                <div className="flex h-16 w-16 items-center justify-center rounded-full">
                  <UploadCloudIcon className="h-full w-full cursor-pointer" />
                </div>

                <button
                  type="button"
                  className="w-64 rounded border border-gray-300 bg-white px-4 py-2 text-center text-sm"
                >
                  Upload File
                </button>

                <p className="text-sm text-gray-600">File formats are {supportedFormatsText}</p>
                {maxSize && <p className="text-sm text-red-500">The maximum file size is {maxSize / 1024 / 1024} MB</p>}
              </div>
            )}
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

const FILE_TYPE_MAPPING = {
  image: {
    mimeTypes: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/jpg': ['.jpg'],
    },
    label: 'Images (PNG, JPG, JPEG)',
  },
  pdf: {
    mimeTypes: {
      'application/pdf': ['.pdf'],
    },
    label: 'PDF',
  },
  doc: {
    mimeTypes: {
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    label: 'DOC, DOCX',
  },
  sheet: {
    mimeTypes: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
    },
    label: 'XLS/XLSX, CSV',
  },
  other: {
    mimeTypes: {
      'text/plain': ['.txt'],
      'application/zip': ['.zip'],
      'application/x-rar-compressed': ['.rar'],
      'application/gzip': ['.tar.gz'],
      'application/x-7z-compressed': ['.7z'],
    },
    label: 'TXT, ZIP, RAR, TAR.GZ, 7Z',
  },
} as const;

const generateAcceptObject = (acceptString?: string) => {
  if (!acceptString) {
    // Default: semua file types
    return Object.values(FILE_TYPE_MAPPING).reduce((acc, curr) => ({ ...acc, ...curr.mimeTypes }), {});
  }

  const categories = acceptString.split(',').map(cat => cat.trim().toLowerCase());
  const acceptObject = {};

  categories.forEach(category => {
    if (FILE_TYPE_MAPPING[category as keyof typeof FILE_TYPE_MAPPING]) {
      Object.assign(acceptObject, FILE_TYPE_MAPPING[category as keyof typeof FILE_TYPE_MAPPING].mimeTypes);
    }
  });

  return acceptObject;
};

// Function untuk generate supported formats text
const generateSupportedFormatsText = (acceptString?: string): string => {
  if (!acceptString) {
    // Default: semua file types
    return Object.values(FILE_TYPE_MAPPING)
      .map(type => type.label)
      .join(', ');
  }

  const categories = acceptString.split(',').map(cat => cat.trim().toLowerCase());
  const labels: string[] = [];

  categories.forEach(category => {
    if (FILE_TYPE_MAPPING[category as keyof typeof FILE_TYPE_MAPPING]) {
      labels.push(FILE_TYPE_MAPPING[category as keyof typeof FILE_TYPE_MAPPING].label);
    }
  });

  return labels.join(', ');
};

// Function untuk generate error message
const generateErrorMessage = (acceptString?: string): string => {
  const supportedFormats = generateSupportedFormatsText(acceptString);
  return `Invalid file format. Supported formats: ${supportedFormats}.`;
};
