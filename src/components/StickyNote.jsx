function  StickyNote() {
// sticky note component, square, yellow, with a shadow, and a title and text inside it
  return (
    <div style={{
      backgroundColor:'rgb(255, 208, 138)',
      width: '200px',
      height: '200px',
      boxShadow: '5px 5px 5px gray',
      padding: '10px',
      borderRadius: '10px'
    }}>
      <h2 style={{ margin: 0 }}>Sticky Note</h2>
      <p>This is a sticky note component.</p>
    </div>
  );

}
export default StickyNote;