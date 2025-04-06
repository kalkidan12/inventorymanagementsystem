import React, { useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";

const TinyMceEditor = ({ handleBodyContent, initialValue }) => {
  const handleChange = (value) => {
    handleBodyContent(value);
  };
  useEffect(() => {}, [initialValue]);

  return (
    <div className="">
      <Editor
        value={initialValue}
        onEditorChange={handleChange}
        apiKey="2tesh8vd5v1pmd9e86t7tgy5ptfpv32vnvpo5jcpfrvgqg6s" //{process.env.TINYMCE_EDITOR_KEY}
        init={{
          branding: false,
          height: 400,
          convert_urls: false,
          document_base_url: "https://kaliget.com/",
          menubar: true,
          directionality: "ltr",
          plugins:
            "print preview paste searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern",
          toolbar:
            "formatselect | blocks fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor blockquote | link anchor  image media | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat",
          image_advtab: true,
          content_style: `
          html {
            scroll-behavior: smooth;
          }
          a {
            cursor: pointer;
          }
        `,
        }}
      />
    </div>
  );
};
export default TinyMceEditor;
