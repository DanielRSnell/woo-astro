import { useState, useEffect } from 'react';

export default function VariationSelector({ variations, selections, onSelect, onClear }) {
  const [currentAttribute, setCurrentAttribute] = useState(null);
  
  const attributeList = variations[0]?.attributes.nodes.map(attr => attr.name) || [];
  
  const attributes = variations.reduce((acc, variation) => {
    variation.attributes.nodes.forEach(attr => {
      if (!acc[attr.name]) {
        acc[attr.name] = new Set();
      }
      acc[attr.name].add(attr.value);
    });
    return acc;
  }, {});

  useEffect(() => {
    const unselectedAttr = attributeList.find(attr => !selections[attr]);
    setCurrentAttribute(unselectedAttr || attributeList[0]);
  }, [selections]);

  const isAvailable = (attrName, attrValue) => {
    return variations.some(variation => {
      const matchesSelected = Object.entries(selections).every(([name, value]) => {
        if (name === attrName) return true;
        const attr = variation.attributes.nodes.find(a => a.name === name);
        return !value || (attr && attr.value === value);
      });

      if (!matchesSelected) return false;

      const attr = variation.attributes.nodes.find(a => a.name === attrName);
      return attr && attr.value === attrValue;
    });
  };

  const formatAttributeName = (name) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleSelect = (name, value) => {
    console.log('Selecting attribute:', { name, value });
    if (!isAvailable(name, value)) return;
    
    const newSelections = { ...selections, [name]: value };
    onSelect(newSelections);
    
    const nextAttr = attributeList.find(attr => !newSelections[attr]);
    if (nextAttr) {
      setCurrentAttribute(nextAttr);
    }
  };

  return (
    <div className="space-y-8">
      {/* Tabs - Only show if there are multiple attributes */}
      {attributeList.length > 1 && (
        <div className="flex w-full rounded-lg bg-muted p-1 text-muted-foreground">
          {attributeList.map((attr) => {
            const isSelected = attr === currentAttribute;
            const hasValue = Boolean(selections[attr]);
            
            return (
              <button
                key={attr}
                onClick={() => setCurrentAttribute(attr)}
                className={`
                  relative flex-1 px-6 py-3 text-sm font-medium transition-all rounded-md
                  ${isSelected 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'hover:text-foreground hover:bg-background/50'
                  }
                `}
              >
                <div className="flex justify-center items-center text-center w-full gap-2">
                  <span className={`
                    h-2 w-2 rounded-full transition-colors
                    ${hasValue 
                      ? 'bg-[var(--color-success-light)]' 
                      : 'bg-muted-foreground'
                    }
                  `} />
                  <span>{formatAttributeName(attr)}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Current Attribute Content */}
      {currentAttribute && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-1">
              {formatAttributeName(currentAttribute)}
            </h3>
            <p className="text-sm text-muted-foreground">
              Select a {formatAttributeName(currentAttribute).toLowerCase()} option
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Array.from(attributes[currentAttribute]).map((value) => {
              const available = isAvailable(currentAttribute, value);
              const selected = selections[currentAttribute] === value;

              return (
                <button
                  key={value}
                  onClick={() => handleSelect(currentAttribute, value)}
                  disabled={!available}
                  className={`
                    flex items-center justify-center rounded-lg border-2 px-6 py-4 text-sm font-medium transition-all
                    ${selected 
                      ? 'border-[var(--color-success-light)] bg-[var(--color-success-light)]/5 text-[var(--color-success)]' 
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }
                    ${available 
                      ? 'cursor-pointer' 
                      : 'cursor-not-allowed opacity-50'
                    }
                  `}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selection Summary */}
      {Object.keys(selections).length > 0 && (
        <div className="rounded-lg bg-muted p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Selected Options</h4>
            <button
              onClick={() => {
                onClear();
                setCurrentAttribute(attributeList[0]);
              }}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Clear all
            </button>
          </div>
          <dl className="space-y-1">
            {Object.entries(selections).map(([name, value]) => (
              <div key={name} className="flex justify-between text-sm">
                <dt className="text-muted-foreground">{formatAttributeName(name)}:</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
