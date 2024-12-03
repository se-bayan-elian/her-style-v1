import React from "react";

function page() {
  return (
    <section dir="rtl" className="text-right flex justify-center items-center ">
      <div className="bg-white shadow-lg rounded-lg  mx-auto  w-[95%] md:w-[90%] lg:w-[80%] my-10 p-6">
        <h1 className="text-2xl font-bold mb-4">من نحن</h1>
        <p className="mb-4">
          مرحبًا بكم في "hawaak"، وجهتكم الموثوقة لشراء المنتجات الزراعية والعطور والكريمات السودانية الأصيلة. نحن هنا لنتشارك معكم ثروات السودان الطبيعية ونقدم لكم أفضل ما تقدمه بلادنا من منتجات.
        </p>
        <h2 className="text-xl font-semibold mb-4">رؤيتنا</h2>
        <p className="mb-4">
          نهدف إلى تعزيز الثقافة السودانية من خلال تقديم منتجات زراعية عالية الجودة وعطور فاخرة وكريمات طبيعية تعكس جمال وتنوع تراثنا.
        </p>
        <h2 className="text-xl font-semibold mb-4">منتجاتنا</h2>
        <ul className=" mb-4">
          <li>
            <strong className="ml-1">المنتجات الزراعية:</strong> نقدم مجموعة متنوعة من المحاصيل وجميعها مزروعة بطرق تقليدية وبأعلى معايير الجودة.
          </li>
          <li>
            <strong className="ml-1">العطور السودانية:</strong> نعرض مجموعة فاخرة من العطور المستخلصة من الزهور والأعشاب المحلية، التي تضفي لمسة من الأصالة والجمال على كل مناسبة.
          </li>
          <li>
            <strong className="ml-1">الكريمات السودانية:</strong> نقدم كريمات طبيعية وعضوية مصنوعة من مكونات محلية تعزز العناية بالبشرة وتمنحها الصحة والنعومة.
          </li>
        </ul>
        <h2 className="text-xl font-semibold mb-4">قيمنا</h2>
        <p className="mb-4">
          نؤمن بأهمية الاستدامة، لذلك نعمل مع المزارعين المحليين ونستخدم مكونات طبيعية وصديقة للبيئة. نحن ملتزمون بتقديم منتجات تعكس التراث السوداني الغني وتساعد في دعم الاقتصاد المحلي.
        </p>
        <p>
          انضموا إلينا في رحلة استكشاف جمال السودان وثرواته الطبيعية، واستمتعوا بتجربة تسوق فريدة من نوعها!
        </p>
      </div>
    </section>
  );
}

export default page;
