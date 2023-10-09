// app/javascript/controllers/uppy_file_upload_controller.js

import { Controller } from "@hotwired/stimulus"
import Uppy from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';
import Cropper from 'cropperjs';
import '@uppy/core/dist/style.min.css';
import 'cropperjs/dist/cropper.css';



export default class extends Controller {
  static targets = ['fileInput', 'imagePreview', 'dragOpen', 'submit'];


  connect() {
    console.log("uppyyyyyy")
    this.initializeUppy();
  }

  initializeUppy() {
    const { cloud_name, api_key, api_secret } = Rails.application.config.cloudinary;
    const uppy = new Uppy({
      autoProceed: true,
      restrictions: {
        maxFileSize: 5 * 1024 * 1024, // Límite de tamaño de archivo de 5 MB
        allowedFileTypes: ['image/*'],
      },
      uploader: XHRUpload,
      meta: {
        // Establece el nombre del preset y la carpeta de Cloudinary (ajusta según tus necesidades)
        cloudinary_preset: 'instagram_rails',
        folder: 'instagram_rails',
      },
    })

    uppy.use(Uppy.Cloudinary, {
      cloudName: cloud_name,
      apiKey: api_key,
      apiSecret: api_secret,
    });

    uppy.on('complete', (result) => {
      console.log('Upload complete:', result);
      const fileData = result.successful[0];
      const cloudinaryUrl = fileData.response.body.url;
      this.fileInputTarget.value = cloudinaryUrl;
    });

    uppy.on('file-added', (file) => {
      console.log('filename:', file);
      this.readAndDisplayImagePreview(file);
    });
  }

  openFinder() {
    this.fileInputTarget.click();

    this.fileInputTarget.addEventListener('change', (event) => {
      const selectedFile = event.target.files[0];
      console.log('filename:', selectedFile);
      if (selectedFile) {
        this.readAndDisplayImagePreview(selectedFile);
      }
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
    this.readAndDisplayImagePreview(droppedFiles[0]);

    // También puedes agregar los archivos soltados al campo de entrada de archivos para su envío
    if (droppedFiles.length > 0) {
      this.fileInputTarget.files = droppedFiles;
    }
  }

  readAndDisplayImagePreview(file) {
    // Usar FileReader para leer la imagen seleccionada y mostrar la vista previa
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataURL = e.target.result;
      this.displayImagePreview(imageDataURL);
    };
    reader.readAsDataURL(file);
  }

  displayImagePreview(dataURL) {
    const imagePreviewElement = this.imagePreviewTarget;
    const cardDragElement = this.dragOpenTarget
    const submitElement = this.submitTarget
    const image = document.getElementById('image');
    if (imagePreviewElement) {
      imagePreviewElement.src = dataURL;
      imagePreviewElement.style.display = 'block';
      submitElement.style.display = 'block';
      cardDragElement.style.display = 'none';
      const cropper = new Cropper(image, {
        viewMode: 1,
        crop(event) {
          console.log(event.detail.x);
          console.log(event.detail.y);
          console.log(event.detail.width);
          console.log(event.detail.height);
          console.log(event.detail.rotate);
          console.log(event.detail.scaleX);
          console.log(event.detail.scaleY);
        },
      });
    }
  }
}
