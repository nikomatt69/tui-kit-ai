import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { SearchBoxProps, SearchBoxVariants, SearchBoxSizes, SearchBoxStates } from './SearchBox.types';
import { SearchBoxStyles } from './SearchBox.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class SearchBox implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: SearchBoxProps;
  private validationResult: ValidationResult;
  private searchValue: string = '';
  private suggestions: string[] = [];
  private selectedSuggestion: number = -1;
  private isSearching: boolean = false;

  constructor(props: SearchBoxProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('SearchBox', props);
    
    if (!this.validationResult.success) {
      console.error('❌ SearchBox validation failed:', this.validationResult.errors);
      throw new Error(`SearchBox validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ SearchBox warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.suggestions = this.props.suggestions || [];
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: SearchBoxStyles.getStyle(this.props),
      content: this.renderSearchBox(),
      align: 'left',
      valign: 'middle',
      keys: true,
      vi: true,
    });
    
    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupEventHandlers();
  }
  
  private setupEventHandlers() {
    // Handle focus events
    this.el.on('focus', () => {
      this.setState('focus');
    });

    this.el.on('blur', () => {
      this.setState('default');
    });

    // Handle key events
    this.el.on('keydown', (event: any) => {
      this.handleKeyDown(event);
    });

    // Handle input events
    this.el.on('input', (event: any) => {
      this.handleInput(event);
    });

    // Handle mouse events
    this.el.on('mouseover', () => {
      this.setState('hover');
    });

    this.el.on('mouseout', () => {
      this.setState('default');
    });

    // Handle click events
    if (this.props.clickable) {
      this.el.on('click', (event: any) => {
        this.handleClick(event);
      });
    }
  }

  private handleKeyDown(event: any) {
    switch (event.key) {
      case 'up':
      case 'k':
        this.selectPreviousSuggestion();
        break;
      case 'down':
      case 'j':
        this.selectNextSuggestion();
        break;
      case 'enter':
        this.performSearch();
        break;
      case 'escape':
        this.clearSearch();
        break;
      case 'tab':
        this.acceptSuggestion();
        break;
    }

    if (this.props.onKeyDown) {
      this.props.onKeyDown({
        type: 'keydown',
        target: this.el,
        key: event.key,
        ctrl: event.ctrl,
        shift: event.shift,
        alt: event.alt,
      });
    }
  }

  private handleInput(event: any) {
    this.searchValue = event.value || '';
    this.isSearching = true;
    this.selectedSuggestion = -1;
    
    this.el.setContent(this.renderSearchBox());
    this.el.screen.render();
    
    if (this.props.onInputChange) {
      this.props.onInputChange({
        type: 'inputchange',
        target: this.el,
        value: this.searchValue,
      });
    }
    
    // Trigger search if autoSearch is enabled
    if (this.props.autoSearch && this.searchValue.length >= (this.props.minSearchLength || 1)) {
      this.performSearch();
    }
  }

  private handleClick(event: any) {
    if (this.props.onClick) {
      this.props.onClick({
        type: 'click',
        target: this.el,
        searchValue: this.searchValue,
        suggestions: this.suggestions,
      });
    }
  }

  private renderSearchBox(): string {
    let content = '';
    
    // Search icon and label
    if (this.props.showIcon) {
      content += `${this.props.searchIcon || '🔍'} `;
    }
    
    if (this.props.label) {
      content += `${this.props.label}: `;
    }
    
    // Search input
    const placeholder = this.props.placeholder || 'Search...';
    content += this.searchValue || placeholder;
    
    // Cursor indicator
    if (this.el.focused) {
      content += '|';
    }
    
    // Search status
    if (this.isSearching) {
      content += ` ${this.props.searchingText || 'Searching...'}`;
    }
    
    // Suggestions dropdown
    if (this.suggestions.length > 0 && this.props.showSuggestions) {
      content += '\n';
      this.suggestions.forEach((suggestion, index) => {
        const prefix = index === this.selectedSuggestion ? '▶ ' : '  ';
        content += `${prefix}${suggestion}\n`;
      });
    }
    
    return content;
  }

  // Variant system methods
  setVariant(variant: SearchBoxVariants) {
    this.props.variant = variant;
    this.el.style = SearchBoxStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: SearchBoxSizes) {
    this.props.size = size;
    this.el.style = SearchBoxStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: SearchBoxStates) {
    this.props.state = state;
    this.el.style = SearchBoxStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // SearchBox-specific methods
  setLabel(label: string) {
    this.props.label = label;
    this.el.setContent(this.renderSearchBox());
    this.el.screen.render();
  }

  setPlaceholder(placeholder: string) {
    this.props.placeholder = placeholder;
    this.el.setContent(this.renderSearchBox());
    this.el.screen.render();
  }

  setSearchIcon(icon: string) {
    this.props.searchIcon = icon;
    this.el.setContent(this.renderSearchBox());
    this.el.screen.render();
  }

  setSuggestions(suggestions: string[]) {
    this.suggestions = suggestions;
    this.selectedSuggestion = -1;
    this.el.setContent(this.renderSearchBox());
    this.el.screen.render();
    
    if (this.props.onSuggestionsChange) {
      this.props.onSuggestionsChange({
        type: 'suggestionschange',
        target: this.el,
        suggestions: this.suggestions,
        previousSuggestions: [],
      });
    }
  }

  addSuggestion(suggestion: string) {
    this.suggestions.push(suggestion);
    this.el.setContent(this.renderSearchBox());
    this.el.screen.render();
    
    if (this.props.onSuggestionAdd) {
      this.props.onSuggestionAdd({
        type: 'suggestionadd',
        target: this.el,
        suggestion,
        totalSuggestions: this.suggestions.length,
      });
    }
  }

  removeSuggestion(suggestion: string) {
    const index = this.suggestions.indexOf(suggestion);
    if (index >= 0) {
      this.suggestions.splice(index, 1);
      
      // Adjust selected suggestion if needed
      if (this.selectedSuggestion === index) {
        this.selectedSuggestion = -1;
      } else if (this.selectedSuggestion > index) {
        this.selectedSuggestion--;
      }
      
      this.el.setContent(this.renderSearchBox());
      this.el.screen.render();
      
      if (this.props.onSuggestionRemove) {
        this.props.onSuggestionRemove({
          type: 'suggestionremove',
          target: this.el,
          suggestion,
          totalSuggestions: this.suggestions.length,
        });
      }
    }
  }

  clearSuggestions() {
    this.suggestions = [];
    this.selectedSuggestion = -1;
    this.el.setContent(this.renderSearchBox());
    this.el.screen.render();
    
    if (this.props.onSuggestionsClear) {
      this.props.onSuggestionsClear({
        type: 'suggestionsclear',
        target: this.el,
      });
    }
  }

  // Search methods
  setSearchValue(value: string) {
    this.searchValue = value;
    this.isSearching = false;
    this.el.setContent(this.renderSearchBox());
    this.el.screen.render();
  }

  performSearch() {
    if (this.searchValue.trim()) {
      this.isSearching = true;
      this.el.setContent(this.renderSearchBox());
      this.el.screen.render();
      
      if (this.props.onSearch) {
        this.props.onSearch({
          type: 'search',
          target: this.el,
          query: this.searchValue,
          suggestions: this.suggestions,
        });
      }
    }
  }

  clearSearch() {
    this.searchValue = '';
    this.isSearching = false;
    this.selectedSuggestion = -1;
    this.el.setContent(this.renderSearchBox());
    this.el.screen.render();
    
    if (this.props.onClear) {
      this.props.onClear({
        type: 'clear',
        target: this.el,
      });
    }
  }

  // Suggestion selection methods
  selectSuggestion(index: number) {
    if (index >= 0 && index < this.suggestions.length) {
      this.selectedSuggestion = index;
      this.el.setContent(this.renderSearchBox());
      this.el.screen.render();
    }
  }

  selectNextSuggestion() {
    if (this.suggestions.length > 0) {
      this.selectedSuggestion = (this.selectedSuggestion + 1) % this.suggestions.length;
      this.el.setContent(this.renderSearchBox());
      this.el.screen.render();
    }
  }

  selectPreviousSuggestion() {
    if (this.suggestions.length > 0) {
      this.selectedSuggestion = this.selectedSuggestion <= 0 
        ? this.suggestions.length - 1 
        : this.selectedSuggestion - 1;
      this.el.setContent(this.renderSearchBox());
      this.el.screen.render();
    }
  }

  acceptSuggestion() {
    if (this.selectedSuggestion >= 0 && this.selectedSuggestion < this.suggestions.length) {
      this.searchValue = this.suggestions[this.selectedSuggestion];
      this.selectedSuggestion = -1;
      this.el.setContent(this.renderSearchBox());
      this.el.screen.render();
      
      if (this.props.onSuggestionSelect) {
        this.props.onSuggestionSelect({
          type: 'suggestionselect',
          target: this.el,
          suggestion: this.searchValue,
        });
      }
    }
  }

  // Display options
  setShowIcon(show: boolean) {
    this.props.showIcon = show;
    this.el.setContent(this.renderSearchBox());
    this.el.screen.render();
  }

  setShowSuggestions(show: boolean) {
    this.props.showSuggestions = show;
    this.el.setContent(this.renderSearchBox());
    this.el.screen.render();
  }

  setAutoSearch(autoSearch: boolean) {
    this.props.autoSearch = autoSearch;
  }

  setMinSearchLength(length: number) {
    this.props.minSearchLength = length;
  }

  // Get current configuration
  getConfig() {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      theme: this.theme,
      label: this.props.label,
      placeholder: this.props.placeholder,
      searchIcon: this.props.searchIcon,
      searchValue: this.searchValue,
      suggestions: this.suggestions,
      selectedSuggestion: this.selectedSuggestion,
      isSearching: this.isSearching,
      showIcon: this.props.showIcon,
      showSuggestions: this.props.showSuggestions,
      autoSearch: this.props.autoSearch,
      minSearchLength: this.props.minSearchLength,
    };
  }

  // Get search box properties
  getLabel(): string | undefined {
    return this.props.label;
  }

  getPlaceholder(): string | undefined {
    return this.props.placeholder;
  }

  getSearchIcon(): string | undefined {
    return this.props.searchIcon;
  }

  getSearchValue(): string {
    return this.searchValue;
  }

  getSuggestions(): string[] {
    return [...this.suggestions];
  }

  getSelectedSuggestion(): number {
    return this.selectedSuggestion;
  }

  getSelectedSuggestionText(): string | undefined {
    return this.selectedSuggestion >= 0 ? this.suggestions[this.selectedSuggestion] : undefined;
  }

  isSearching(): boolean {
    return this.isSearching;
  }

  // Update component with new props
  update(newProps: Partial<SearchBoxProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('SearchBox', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ SearchBox update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = SearchBoxStyles.getStyle(this.props);
    
    // Update suggestions if changed
    if (newProps.suggestions !== undefined) {
      this.setSuggestions(this.props.suggestions || []);
    }
    
    // Update content if any display properties changed
    if (newProps.label !== undefined || 
        newProps.placeholder !== undefined ||
        newProps.searchIcon !== undefined ||
        newProps.showIcon !== undefined ||
        newProps.showSuggestions !== undefined) {
      this.el.setContent(this.renderSearchBox());
    }
    
    this.el.screen.render();
  }

  // Focus management
  focus() {
    this.el.focus();
  }

  blur() {
    this.el.blur();
  }

  // Visibility management
  show() {
    this.el.show();
    this.el.screen.render();
  }

  hide() {
    this.el.hide();
    this.el.screen.render();
  }

  // Get validation result for debugging
  getValidationResult(): ValidationResult {
    return this.validationResult;
  }
}