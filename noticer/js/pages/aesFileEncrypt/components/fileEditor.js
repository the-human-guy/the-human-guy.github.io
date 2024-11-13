const { useEffect, useState } = React

export const FileEditor = ({ onSave, file }) => {
    const [fileContent, setFileContent] = useState();

    useEffect(() => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target.result;
        setFileContent(fileContent)
      };
      reader.readAsText(file);
    }, [file])

  const saveFile = () => {
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const newFile = new File([blob], `new-${file.name}`)
    onSave(newFile)
  }

  return (
    <div>
      <div class="row">
        <div class="col">
          <textarea onChange={e => setFileContent(e.target.value)} cols="30" rows="10" value={fileContent}></textarea>
        </div>
        <div class="col">
          <div class="editor-preview-container">
            <iframe
              sandbox
              srcdoc={fileContent}
            ></iframe>
          </div>
        </div>
    </div>
      
      
      <button type="button" onClick={saveFile}>Save changes</button>
    </div>
  )
}
