const { useEffect, useState } = React

/*
todo: add more editor options:
- https://github.com/JiHong88/SunEditor
- https://github.com/samclarke/SCEditor
- https://github.com/xdan/jodit
- https://github.com/bevacqua/woofmark
*/

export const FileEditor = ({ onSave, file: originalFile }) => {
  const [fileContent, setFileContent] = useState();

  const resetToOriginalFile = () => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target.result;
      setFileContent(fileContent)
    };
    reader.readAsText(originalFile);
  }

  useEffect(() => {
    resetToOriginalFile()
  }, [originalFile])

  const saveFile = () => {
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const newFile = new File([blob], `new-${originalFile.name}`)
    onSave(newFile)
  }

  const wrapWithPre = () => setFileContent(`<pre>
${fileContent}
</pre>
`)

  return (
    <div>
      <button type="button" onClick={saveFile}>Save changes</button>
      <button type="button" onClick={wrapWithPre}>{'Wrap with <pre>'}</button>
      <button type="reset" onClick={resetToOriginalFile}>Reset</button>

      <div class="row">
        <div class="col">
          <textarea onChange={e => setFileContent(e.target.value)} cols="30" rows="33" value={fileContent} style={{ width: '100%' }}></textarea>
        </div>
        <div class="col editor-preview-container">
          <iframe
            sandbox
            srcdoc={fileContent}
          ></iframe>
        </div>
      </div>
    </div>
  )
}
