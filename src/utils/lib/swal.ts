import Swal from 'sweetalert2';

const swal = Swal.mixin({
  customClass: {
    confirmButton: 'bg-main-blue-alurkerja text-white rounded-lg py-3 px-5 mx-1',
    cancelButton: 'bg-gray-alurkerja-3 text-black rounded-lg py-3 px-5 mx-1',
  },
  buttonsStyling: false,
});

const swalDelete = swal.mixin({
  title: 'Alert',
  text: 'This action cannot be undone. Are you sure you want to proceed and delete the data?',
  icon: 'warning',
  customClass: {
    confirmButton: 'bg-red-alurkerja text-white rounded-lg p-3 mx-1',
    cancelButton: 'bg-gray-alurkerja-3 text-black rounded-lg p-3 mx-1',
  },
  buttonsStyling: false,
  showCancelButton: true,
  showLoaderOnConfirm: true,
  reverseButtons: true,
  allowOutsideClick: () => !swal.isLoading(),
});

const swalConfirm = swal.mixin({
  title: 'Alert',
  text: `You're about to modify existing data. Proceed with the changes?`,
  icon: 'warning',
  customClass: {
    confirmButton: 'bg-main-blue-alurkerja text-white rounded-lg py-3 px-5 mx-1',
    cancelButton: 'bg-gray-alurkerja-3 text-black rounded-lg py-3 px-5 mx-1',
  },
  buttonsStyling: false,
  showCancelButton: true,
  showLoaderOnConfirm: true,
  reverseButtons: true,
  allowOutsideClick: () => !swal.isLoading(),
});

const swalDeleteWithList = ({ items, preConfirm }: { items: string[]; preConfirm: () => unknown }) => {
  const selecteds = items.map(item => `<li>${item}</li>`).join('');
  const html = `
<p>This action cannot be undone. Are you sure you want to proceed and delete the data?</p>
<div style="text-align: start; margin-top: 1em; border: 1px solid black; max-height: 8em; overflow: auto;">
<p>These will be deleted:</p>
<ul style="list-style: disc; list-style-position: inside;">${selecteds}</ul>
</div>
`;
  return swalDelete.fire({
    html,
    preConfirm,
  });
};

const swalSuccess = swal.mixin({
  title: 'Success',
  icon: 'success',
});

const swalError = swal.mixin({
  title: 'Sorry',
  icon: 'error',
});

const swalErrorDefault = swalError.mixin({
  text: 'Something went wrong, please try again.',
});

const swalLoading = swal.mixin({
  title: 'In progress',
  text: 'Please wait...',
  showConfirmButton: false,
  willOpen: () => {
    swal.showLoading();
  },
});

const swalSuccessEditDefault = swalSuccess.mixin({
  title: 'Edit data successfull',
  text: 'You have successfully edit data.',
});

const swalErrorEditDefault = swalError.mixin({
  title: 'Edit data failed',
  text: 'Edit data failed, please try again.',
});

const swalWithInputText = swal.mixin({
  input: 'text',
  inputAttributes: {
    autocapitalize: 'off',
  },
});

export {
  swal,
  swalDelete,
  swalSuccess,
  swalError,
  swalErrorDefault,
  swalConfirm,
  swalLoading,
  swalDeleteWithList,
  swalSuccessEditDefault,
  swalErrorEditDefault,
  swalWithInputText,
};
