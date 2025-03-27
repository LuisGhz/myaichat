import "./InputSection.css";

export const InputSection = () => {
  return (<>
    <section className="my-2 flex bg-input-section p-2 justify-evenly">
      <span>+</span>
      <textarea className="input py-2 px-4" placeholder="Message MyAIChat" ></textarea>
      <span>Microphone</span>
    </section>
  </>)
};