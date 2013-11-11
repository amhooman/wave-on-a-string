/**
 * Copyright 2002-2013, University of Colorado
 * view for slider control
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var HSlider = require( 'SUN/HSlider' );
  var ArrowButton = require( 'SCENERY_PHET/ArrowButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Range = require( 'DOT/Range' );
  var Property = require( 'AXON/Property' );

  function Slider( options ) {
    var thisNode = this,
      defaultOptions = {
        type: 'simple',
        property: new Property( 0 ),
        range: new Range( 0, 100 ),
        sliderSize: new Dimension2( 200, 110 ),
        tick: {step: 1, minText: '', maxText: ''},
        title: '',
        patternValueUnit: '',
        buttonStep: 1,
        rounding: false,
        // custom track
        trackSize: new Dimension2( 140, 2 ),
        trackFill: 'black',
        // custom thumb
        thumbSize: new Dimension2( 22, 38 ),
        thumbFillEnabled: '#98BECF',
        thumbFillHighlighted: '#B3D3E2',
        // custom ticks
        tickLabelSpacing: 4,
        majorTickLength: 35,
        minorTickLength: 25
      };
    Node.call( thisNode );
    options = _.extend( {}, defaultOptions, options );
    if ( !options.endDrag && options.rounding !== false ) {
      options.endDrag = function() {
        options.property.set( Math.round( options.property.get() * Math.pow( 10, options.rounding ) ) / Math.pow( 10, options.rounding ) );
      };
    }

    thisNode.addChild( new Rectangle( 0, 0, options.sliderSize.width, options.sliderSize.height ) );

    this.addChild( new Text( options.title, {centerX: thisNode.width / 2, top: 0, font: new PhetFont( 18 )} ) );

    var buttonNode, plusButton, minusButton, valueLabel;
    var hSlider = new HSlider( options.property, options.range, options );
    var hSliderNode = new Node( {children: [hSlider], x: (thisNode.width - options.trackSize.width) / 2, bottom: thisNode.height - 0} );
    thisNode.addChild( hSliderNode );

    if ( options.type === 'simple' && options.tick && options.tick.step ) {
      var i = options.range.min;

      for ( ; i <= options.range.max; i += options.tick.step ) {

        if ( i === options.range.max ) {
          hSlider.addMajorTick( i, new Text( options.tick.maxText, {font: new PhetFont( 15 )} ) );
        }
        else if ( i === options.range.min ) {
          hSlider.addMajorTick( i, new Text( options.tick.minText, {font: new PhetFont( 15 )} ) );
        }
        else if ( i === (options.range.min + options.range.max) / 2 ) {
          hSlider.addMajorTick( i );
        }
        else {
          hSlider.addMinorTick( i );
        }
      }
    }

    if ( options.type === 'button' ) {
      buttonNode = new Node( {y: 25} );
      var buttonPropertyUpdate = function( value ) {
        return function() {
          options.property.set( Math.max( Math.min( options.property.get() + value, options.range.max ), options.range.min ) );
        };
      };
      buttonNode.addChild( plusButton = new ArrowButton( 'right', buttonPropertyUpdate( options.buttonStep ), {right: thisNode.width - 15, centerY: 15} ) );
      buttonNode.addChild( minusButton = new ArrowButton( 'left', buttonPropertyUpdate( -options.buttonStep ), {left: 15, centerY: 15} ) );
      buttonNode.addChild( new Rectangle( 0, 0, 90, 30, 5, 5, {fill: '#FFF', stroke: '#000', lineWidth: 1, centerX: thisNode.width / 2, top: 0} ) );
      buttonNode.addChild( valueLabel = new Text( '0', {font: new PhetFont( 18 ), centerX: options.width / 2, top: 5} ) );
      this.addChild( buttonNode );
    }

    thisNode.mutate( _.omit( options, Object.keys( defaultOptions ) ) );

    options.property.link( function updateProperty( value ) {
      if ( options.type === 'button' ) {
        var text = value;
        if ( options.rounding !== false && options.rounding >= 0 ) {
          text = options.property.get().toFixed( options.rounding );
        }
        valueLabel.text = StringUtils.format( options.patternValueUnit, text );
        valueLabel.centerX = thisNode.width / 2;
        plusButton.setEnabled( value < options.range.max );
        minusButton.setEnabled( value > options.range.min );
      }
    } );
  }

  inherit( Node, Slider );

  return Slider;
} );
