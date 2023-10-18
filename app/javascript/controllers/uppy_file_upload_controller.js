import { Controller } from "@hotwired/stimulus"
import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import ImageEditor from "@uppy/image-editor";
import ActiveStorageUpload from '@excid3/uppy-activestorage-upload';
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import "@uppy/image-editor/dist/style.css";



export default class extends Controller {
  static targets = ['fileInput', 'imagePreview', 'dragOpen', 'submit', 'dashPreview'];

  connect() {
    console.log("uppyyyyyy")
    this.initializeUppy();
  }

  initializeUppy() {

    const uppy = new Uppy({
      debug: true,
      autoProceed: false,
      restrictions: {
        maxFileSize: 5 * 1024 * 1024, // Límite de tamaño de archivo de 5 MB
        allowedFileTypes: ['image/*'],
        maxNumberOfFiles: 1,
      },

    });

    uppy.use(Dashboard, {
      trigger: '#UppyModalOpenerBtn',
      inline: true,
      target: '#DashboardContainer',
      replaceTargetContent: true,
      height: 400,
      width: 300,
      browserBackButtonClose: true,
      hideUploadButton: true,

    });

    uppy.use(ActiveStorageUpload, {
      directUploadUrl: document.querySelector("meta[name='direct-upload-url']").getAttribute("content")
    });

    uppy.use(ImageEditor, { target: Dashboard });


    uppy.on('complete', (result) => {
      console.log('Upload complete:', result);
      const fileData = result.successful[0];
      console.log('Uploaded', fileData);
    });



    uppy.on('file-editor:start', (file) => {
      console.log('file-editor:start');
      console.log(file);
    });

    uppy.on('file-editor:complete', (updatedFile) => {
      console.log('file-editor:complete');
      console.log(updatedFile);
      this.updateFileInput(updatedFile);
    });

    this.uppy = uppy;

  }

  openFinder() {
    this.fileInputTarget.click();

    this.fileInputTarget.addEventListener('change', (event) => {
      console.log('Archivos seleccionados:', event.target.files);
      const selectedFile = event.target.files[0];
      this.openEditor(selectedFile);

    });
  }

  handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
  }

  handleDragLeave(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
  }

  handleDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');

    // Accede a los archivos soltados desde event.dataTransfer.files
    const droppedFiles = event.dataTransfer.files;

    // Maneja los archivos soltados aquí
    console.log('Archivos soltados:', droppedFiles);
    const selectedFile = droppedFiles[0];
    this.openEditor(selectedFile);

    // También puedes agregar los archivos soltados al campo de entrada de archivos para su envío
    if (droppedFiles.length > 0) {
      this.fileInputTarget.files = droppedFiles;
    }
  }

  openEditor(data) {
    const dashPreviewElement = this.dashPreviewTarget;
    const submitElement = this.submitTarget;
    const cardDragElement = this.dragOpenTarget
    cardDragElement.style.display = 'none';
    uppy.addFile({
      name: data.name, // You can specify any name you like
      type: data.type,
      data: data,
    });

    dashPreviewElement.style.display = 'block';
    submitElement.style.display = 'block';
  }

  updateFileInput(file) {
    const editedFile = new File([file.data], file.name, { type: 'image/jpeg', lastModified: file.lastModified });

    const fileList = new DataTransfer();
    fileList.items.add(editedFile);

    this.fileInputTarget.files = fileList.files;

  }

  submitImage() {
    uppy.upload();
  }


}
