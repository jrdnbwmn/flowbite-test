import { Controller } from "@hotwired/stimulus"

/**
 * @typedef {Object} ComponentConfig
 * @property {string} selector - CSS selector for finding component elements
 * @property {string} windowClass - Global Flowbite class name (e.g., 'Modal', 'Dropdown')
 * @property {string} [targetAttribute] - Data attribute containing target element ID
 * @property {boolean} needsTarget - Whether component requires a target element
 * @property {string} instanceKey - Property name for storing component instance reference
 */

/**
 * Flowbite Stimulus Controller
 * 
 * Manages Flowbite component initialization and lifecycle with Turbo compatibility.
 * Automatically detects and initializes all Flowbite components within the controller's scope.
 * 
 * Features:
 * - Automatic component detection via MutationObserver
 * - Memory leak prevention through proper cleanup
 * - Turbo-compatible with debounced reinitializations
 * - Configuration-driven architecture for easy maintenance
 * 
 * @class FlowbiteController
 * @extends {Controller}
 */
export default class extends Controller {
  /** @type {number} Debounce timeout for reinitializations (ms) */
  static DEBOUNCE_TIMEOUT = 50

  /** @type {Object.<string, ComponentConfig>} Configuration for all Flowbite components */
  static COMPONENT_CONFIGS = {
    dropdown: {
      selector: '[data-dropdown-toggle]',
      windowClass: 'Dropdown',
      targetAttribute: 'data-dropdown-toggle',
      needsTarget: true,
      instanceKey: '_flowbiteDropdown'
    },
    modal: {
      selector: '[data-modal-target]',
      windowClass: 'Modal',
      targetAttribute: 'data-modal-target',
      needsTarget: true,
      instanceKey: '_flowbiteModal'
    },
    accordion: {
      selector: '[data-accordion]',
      windowClass: 'Accordion',
      needsTarget: false,
      instanceKey: '_flowbiteAccordion'
    },
    tabs: {
      selector: '[data-tabs-toggle]',
      windowClass: 'Tabs',
      targetAttribute: 'data-tabs-toggle',
      needsTarget: true,
      instanceKey: '_flowbiteTabs'
    },
    datepicker: {
      selector: '[data-datepicker]',
      windowClass: 'Datepicker',
      needsTarget: false,
      instanceKey: '_flowbiteDatepicker'
    },
    tooltip: {
      selector: '[data-tooltip-target]',
      windowClass: 'Tooltip',
      targetAttribute: 'data-tooltip-target',
      needsTarget: true,
      instanceKey: '_flowbiteTooltip'
    },
    popover: {
      selector: '[data-popover-target]',
      windowClass: 'Popover',
      targetAttribute: 'data-popover-target',
      needsTarget: true,
      instanceKey: '_flowbitePopover'
    },
    carousel: {
      selector: '[data-carousel]',
      windowClass: 'Carousel',
      needsTarget: false,
      instanceKey: '_flowbiteCarousel'
    },
    drawer: {
      selector: '[data-drawer-target]',
      windowClass: 'Drawer',
      targetAttribute: 'data-drawer-target',
      needsTarget: true,
      instanceKey: '_flowbiteDrawer'
    },
    dismiss: {
      selector: '[data-dismiss-target]',
      windowClass: 'Dismiss',
      targetAttribute: 'data-dismiss-target',
      needsTarget: true,
      instanceKey: '_flowbiteDismiss'
    },
    collapse: {
      selector: '[data-collapse-toggle]',
      windowClass: 'Collapse',
      targetAttribute: 'data-collapse-toggle',
      needsTarget: true,
      instanceKey: '_flowbiteCollapse'
    },
    copyClipboard: {
      selector: '[data-copy-to-clipboard-target]',
      windowClass: 'CopyClipboard',
      targetAttribute: 'data-copy-to-clipboard-target',
      needsTarget: true,
      instanceKey: '_flowbiteCopyClipboard'
    },
    inputCounter: {
      selector: '[data-input-counter]',
      windowClass: 'InputCounter',
      needsTarget: false,
      instanceKey: '_flowbiteInputCounter'
    },
    dial: {
      selector: '[data-dial-init]',
      windowClass: 'Dial',
      needsTarget: false,
      instanceKey: '_flowbiteDial'
    }
  }

  /** @type {string} Pre-compiled selector string for all Flowbite components */
  static ALL_SELECTORS = Object.values(this.COMPONENT_CONFIGS).map(config => config.selector).join(', ')
  
  /** @type {string[]} Array of all Flowbite data attributes for fast detection */
  static ALL_ATTRIBUTES = Object.values(this.COMPONENT_CONFIGS)
    .map(config => config.targetAttribute || config.selector.match(/\[([^\]]+)\]/)?.[1])
    .filter(Boolean)

  /**
   * Stimulus connect lifecycle method
   * Initializes all Flowbite components and sets up DOM change observer
   */
  connect() {
    try {
      this.initializeFlowbiteComponents()
      this.observer = this.createMutationObserver()
    } catch (error) {
      console.error('[FlowbiteController] Failed to initialize:', error)
    }
  }

  /**
   * Stimulus disconnect lifecycle method
   * Cleans up observer and destroys component instances
   */
  disconnect() {
    try {
      if (this.observer) {
        this.observer.disconnect()
        this.observer = null
      }
      this.destroyFlowbiteComponents()
    } catch (error) {
      console.error('[FlowbiteController] Failed to cleanup:', error)
    }
  }

  /**
   * Initializes all Flowbite components within the controller's scope
   * Destroys existing instances first to prevent duplicates
   */
  initializeFlowbiteComponents() {
    try {
      if (window.FlowbiteInstances) {
        this.destroyFlowbiteComponents()
      }
      
      // Initialize all components using configuration
      Object.entries(this.constructor.COMPONENT_CONFIGS).forEach(([name, config]) => {
        try {
          this.initializeComponent(config)
        } catch (error) {
          console.warn(`[FlowbiteController] Failed to initialize ${name} components:`, error)
        }
      })
    } catch (error) {
      console.error('[FlowbiteController] Failed to initialize components:', error)
    }
  }

  /**
   * Initializes a specific type of Flowbite component
   * 
   * @param {Object} config - Component configuration object
   * @param {string} config.selector - CSS selector for finding elements
   * @param {string} config.windowClass - Global Flowbite class name
   * @param {string} [config.targetAttribute] - Data attribute containing target ID
   * @param {boolean} config.needsTarget - Whether component requires a target element
   * @param {string} config.instanceKey - Property name for storing instance reference
   */
  initializeComponent(config) {
    const { selector, windowClass, targetAttribute, needsTarget, instanceKey } = config
    
    // Check if Flowbite class exists globally
    const FlowbiteClass = window[windowClass]
    if (!FlowbiteClass) {
      console.warn(`[FlowbiteController] ${windowClass} not found - ensure Flowbite is loaded`)
      return
    }
    
    const elements = this.element.querySelectorAll(selector)
    
    elements.forEach(element => {
      try {
        // Skip if already initialized
        if (element[instanceKey]) return
        
        if (needsTarget && targetAttribute) {
          // Components that need a target element (modals, dropdowns, etc.)
          const targetId = element.getAttribute(targetAttribute)
          if (!targetId) {
            console.warn(`[FlowbiteController] Missing ${targetAttribute} on element:`, element)
            return
          }
          
          const target = document.getElementById(targetId)
          if (!target) {
            console.warn(`[FlowbiteController] Target element #${targetId} not found for:`, element)
            return
          }
          
          element[instanceKey] = new FlowbiteClass(target, element)
        } else {
          // Components that work on the element itself (datepickers, carousels, etc.)
          element[instanceKey] = new FlowbiteClass(element)
        }
      } catch (error) {
        console.error(`[FlowbiteController] Failed to initialize ${windowClass} on element:`, element, error)
      }
    })
  }

  /**
   * Destroys all Flowbite component instances within this controller's scope
   * Prevents memory leaks by cleaning up event listeners and references
   */
  destroyFlowbiteComponents() {
    try {
      if (!window.FlowbiteInstances?._instances) return
      
      const scope = this.element
      
      Object.keys(window.FlowbiteInstances._instances).forEach(key => {
        try {
          const instance = window.FlowbiteInstances._instances[key]
          const targetEl = instance._targetEl || instance._element
          
          // Only destroy instances that belong to this controller's scope
          if (targetEl && scope.contains(targetEl)) {
            if (typeof instance.destroyAndRemoveInstance === 'function') {
              instance.destroyAndRemoveInstance()
            } else {
              console.warn(`[FlowbiteController] Instance ${key} missing destroy method`)
            }
          }
        } catch (error) {
          console.error(`[FlowbiteController] Failed to destroy instance ${key}:`, error)
        }
      })
    } catch (error) {
      console.error('[FlowbiteController] Failed to destroy components:', error)
    }
  }

  /**
   * Creates a MutationObserver to detect DOM changes and reinitialize components
   * Uses debouncing to prevent excessive reinitializations
   * 
   * @returns {MutationObserver} The configured observer instance
   */
  createMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      let shouldReinit = false
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const hasFlowbiteElements = (nodes) => {
            return Array.from(nodes).some(node => {
              if (node.nodeType !== 1) return false // Only check element nodes
              
              try {
                // Check if node has any Flowbite data attributes
                const hasAttribute = this.constructor.ALL_ATTRIBUTES.some(attr => 
                  node.hasAttribute && node.hasAttribute(attr)
                )
                
                // Check if node contains any Flowbite elements
                const hasChildElements = node.querySelector && 
                  node.querySelector(this.constructor.ALL_SELECTORS)
                
                return hasAttribute || hasChildElements
              } catch (error) {
                // Ignore errors from invalid nodes (like text nodes)
                return false
              }
            })
          }
          
          if (hasFlowbiteElements(mutation.addedNodes) || hasFlowbiteElements(mutation.removedNodes)) {
            shouldReinit = true
          }
        }
      })
      
      if (shouldReinit) {
        // Debounce reinitializations to prevent excessive calls
        clearTimeout(this.reinitTimeout)
        this.reinitTimeout = setTimeout(() => {
          this.initializeFlowbiteComponents()
        }, this.constructor.DEBOUNCE_TIMEOUT)
      }
    })
    
    observer.observe(this.element, {
      childList: true,
      subtree: true
    })
    
    return observer
  }
}