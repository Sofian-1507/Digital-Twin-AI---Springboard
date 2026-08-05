/**
 * InsightList — shared rendering logic for "card with a list of text insights"
 * components (AIInsights, RecommendationCard, LifestyleRecommendation), which
 * previously each reimplemented the same default-fallback + map-to-divs pattern.
 * className props let each caller keep its own existing CSS hooks unchanged.
 */
function InsightList({ title, items, defaultItems, cardClassName, listClassName, itemClassName }) {
  const resolvedItems = items && items.length > 0 ? items : defaultItems;

  return (
    <div className={cardClassName}>

      <h3>{title}</h3>

      {listClassName ? (
        <div className={listClassName}>
          {resolvedItems.map((text, i) => (
            <div className={itemClassName} key={i}>
              {text}
            </div>
          ))}
        </div>
      ) : (
        resolvedItems.map((text, i) => (
          <div className={itemClassName} key={i}>
            {text}
          </div>
        ))
      )}

    </div>
  );
}

export default InsightList;
