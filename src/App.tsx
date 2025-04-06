function App() {
  return (
    <div className="container">
      <h1>Submit Form</h1>
      <form action="/api/form" method="POST">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea id="message" name="message" />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
