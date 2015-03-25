(function(){
	"use strict";

	var root = this,
		Chart = root.Chart,
		helpers = Chart.helpers;

	var defaultConfig = {
		percentageArc: 70,
		percentageInnerCutout: 70,
		animationSteps: 100,
		animationEasing: "easeOutBounce",
		legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><li><span style=\"background-color:<%=segment.fillColor%>\"></span><%if(segment.label){%><%=segment.label%><%}%></li></ul>"
	};

	Chart.Type.extend({
		name: "Dial",
		defaults: defaultConfig,
		initialize: function(data){
			this.segment = null;
			this.backgroundSegment = null;

			this.startAngle = Math.PI * (0.5 + ((100 - this.options.percentageArc) / 100));
			this.endAngle = Math.PI * (2.5 - ((100 - this.options.percentageArc) / 100));
			this.outerRadius = this.calculateOuterRadius();

			this.SegmentArc = Chart.Arc.extend({
				ctx: this.chart.ctx
			});
			helpers.extend(this.SegmentArc.prototype, this.calculateOrigin());

			this.setData(data, true);
			this.render();
		},
		calculateOuterRadius: function(){
			var theta = Math.PI * ((100 - this.options.percentageArc) / 100);
			return helpers.min([
				this.chart.width / 2,
				this.chart.height / (1 + Math.cos(theta))
			]);
		},
		calculateOrigin: function(){
			var theta = Math.PI * ((100 - this.options.percentageArc) / 100);
			return {
				x: this.chart.width / 2,
				y: (this.chart.height + this.outerRadius * (1 - Math.cos(theta))) / 2
			};
		},
		setData: function(data, silent){
			this.segment = new this.SegmentArc({
				value: data.value,
				maxValue: data.maxValue,
				outerRadius: this.outerRadius,
				innerRadius: this.outerRadius * (this.options.percentageInnerCutout / 100),
				fillColor: data.color,
				highlightColor: data.highlight || data.color,
				startAngle: this.startAngle,
				endAngle: this.startAngle
			});
			this.backgroundSegment = new this.SegmentArc({
				outerRadius: this.outerRadius,
				innerRadius: this.outerRadius * (this.options.percentageInnerCutout / 100),
				fillColor: data.background,
				highlightColor: data.background,
				startAngle: this.startAngle,
				endAngle: this.endAngle
			});

			if (!silent){
				this.reflow();
				this.update();
			}
		},
		lerp: function (value, from1, from2, to1, to2) {
			return to1 + (to2 - to1) * (value - from1) / (from2 - from1);
		},
		update: function(){
			// Reset any highlight colors before updating.
			helpers.each(this.activeElements, function(activeElement){
				activeElement.restore(['fillColor']);
			});

			this.segment.save();
			this.backgroundSegment.save();

			this.render();
		},
		reflow: function(){
			this.outerRadius = this.calculateOuterRadius();
			helpers.extend(this.SegmentArc.prototype, this.calculateOrigin());
			this.segment.update({
				outerRadius: this.outerRadius,
				innerRadius: (this.outerRadius/100) * this.options.percentageInnerCutout
			});
			this.backgroundSegment.update({
				outerRadius: this.outerRadius,
				innerRadius: (this.outerRadius/100) * this.options.percentageInnerCutout
			});
		},
		draw: function(easeDecimal){
			var animDecimal = (easeDecimal) ? easeDecimal: 1;
			this.clear();

			var midAngle = this.lerp(this.segment.value, 0, this.segment.maxValue, this.startAngle, this.endAngle);
			this.segment.transition({ endAngle: midAngle }, animDecimal);
			this.backgroundSegment.transition({ startAngle: midAngle }, animDecimal);

			if (isDrawableAngle(this.startAngle, midAngle))
				this.segment.draw();
			if (isDrawableAngle(midAngle, this.endAngle))
				this.backgroundSegment.draw();
		}
	});

	function isDrawableAngle(startAngle, endAngle) {
		// IE8 with ExplorerCanvas has an issue where arcs of near zero length are drawn as filled circles with
		// a radius of the arc innerRadius.  This determines whether an angle is too small to be properly rendered.
		return Math.abs(endAngle - startAngle) > 0.0005;
	}

}).call(this);