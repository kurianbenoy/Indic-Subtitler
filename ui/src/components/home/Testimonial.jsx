const testimonials = [
  {
    name: "Jack Tyson",
    field: "Media Group",
    testimonial:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus, odit? Autem veritatis ut, id dolorem distinctio, cum, a officia eveniet sint facere enim temporibus repellat magnam. Obcaecati minima rem recusandae maiores velit!",
  },
];

const Testimonial = () => {
  return (
    <section className="px-16 py-4 lg:py-10 my-28 hidden">
      <div className="container mx-auto">
        <h2 className="text-3xl text-center font-bold mb-8">
          Here's what our users have to say about us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:px-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:bg-blue-100 drop-shadow-lg"
              style={{ minHeight: "30vh" }}
            >
              <p className="text-gray-600 mb-4">{testimonial.testimonial}</p>
              <div className="flex items-center">
                <div>
                  <p className="text-gray-800 font-bold">{testimonial.name}</p>
                  <p className="text-gray-600">{testimonial.field}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
