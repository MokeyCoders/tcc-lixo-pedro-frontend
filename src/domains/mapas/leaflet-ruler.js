// eslint-disable-next-line import/no-import-module-exports
import L from 'leaflet';

(function (factory, window) {
  /* eslint-disable */
  if (typeof define === "function" && define.amd) {
    define(["leaflet"], factory);
  } else if (typeof exports === "object") {
    module.exports = factory(require("leaflet"));
  }
  if (typeof window !== "undefined" && window.L) {
    window.L.Ruler = factory(L);
  }
}(function (L) {
  L.Control.Ruler = L.Control.extend({
    options: {
      position: "topright",
      circleMarker: {
        color: "red",
        radius: 2
      },
      lineStyle: {
        color: "red",
        dashArray: "1,6"
      },
      lengthUnit: {
        display: "km",
        decimal: 2,
        factor: null,
        label: "Distance:"
      },
      angleUnit: {
        display: "&deg;",
        decimal: 2,
        factor: null,
        label: "Bearing:"
      }
    },
    onAdd: function (map) {
      this._map = map;
      this._container = L.DomUtil.create("div", "leaflet-bar");
      this._container.classList.add("leaflet-ruler");
      L.DomEvent.disableClickPropagation(this._container);
      L.DomEvent.on(this._container, "click", this._toggleMeasure, this);
      this._choice = false;
      this._defaultCursor = this._map._container.style.cursor;
      this._allLayers = L.layerGroup();
      return this._container;
    },
    onRemove: function () {
      L.DomEvent.off(this._container, "click", this._toggleMeasure, this);
    },
    _toggleMeasure: function () {
      this._choice = !this._choice;
      this.clickedLatLong = null;
      this.clickedPoints = [];
      this._totalLength = 0;
      if (this._choice) {
        this._map.doubleClickZoom.disable();
        L.DomEvent.on(this._map._container, "keydown", this.escape, this);
        L.DomEvent.on(this._map._container, "dblclick", this._closePath, this);
        this._container.classList.add("leaflet-ruler-clicked");
        this.clickCount = 0;
        this._tempLine = L.featureGroup().addTo(this._allLayers);
        this._tempPoint = L.featureGroup().addTo(this._allLayers);
        this._pointLayer = L.featureGroup().addTo(this._allLayers);
        this._polylineLayer = L.featureGroup().addTo(this._allLayers);
        this._allLayers.addTo(this._map);
        this._map._container.style.cursor = "crosshair";
        this._map.on("click", this.clicked, this);
        this._map.on("mousemove", this._moving, this);
      } else {
        this._map.doubleClickZoom.enable();
        L.DomEvent.off(this._map._container, "keydown", this.escape, this);
        L.DomEvent.off(this._map._container, "dblclick", this._closePath, this);
        this._container.classList.remove("leaflet-ruler-clicked");
        this._map.removeLayer(this._allLayers);
        this._allLayers = L.layerGroup();
        this._map._container.style.cursor = this._defaultCursor;
        this._map.off("click", this.clicked, this);
        this._map.off("mousemove", this._moving, this);
      }
    },
    clicked: function (e) {
      this.clickedLatLong = e.latlng;
      this.clickedPoints.push(this.clickedLatLong);
      L.circleMarker(this.clickedLatLong, this.options.circleMarker).addTo(
        this._pointLayer
      );
      if (
        this.clickCount > 0 &&
        !e.latlng.equals(this.clickedPoints[this.clickedPoints.length - 2])
      ) {
        if (this._movingLatLong) {
          L.polyline(
            [this.clickedPoints[this.clickCount - 1], this._movingLatLong],
            this.options.lineStyle
          ).addTo(this._polylineLayer);
        }
        let text;
        this._totalLength += this._result.Distance;
        if (this.clickCount > 1) {
          text =`${this.options.lengthUnit.label} </b>&nbsp; ${this._totalLength.toFixed(this.options.lengthUnit.decimal)} &nbsp; ${this.options.lengthUnit.display}`
        } else {
          text =
            this.options.lengthUnit.label +
            "</b>&nbsp;" +
            this._result.Distance.toFixed(this.options.lengthUnit.decimal) +
            "&nbsp;" +
            this.options.lengthUnit.display;
        }
        L.circleMarker(this.clickedLatLong, this.options.circleMarker)
          .bindTooltip(text, { permanent: true, className: "result-tooltip" })
          .addTo(this._pointLayer)
          .openTooltip();
      }
      this.clickCount++;
    },
    _moving: function (e) {
      if (this.clickedLatLong) {
        L.DomEvent.off(this._container, "click", this._toggleMeasure, this);
        this._movingLatLong = e.latlng;
        if (this._tempLine) {
          this._map.removeLayer(this._tempLine);
          this._map.removeLayer(this._tempPoint);
        }
        let text;
        this._addedLength = 0;
        this._tempLine = L.featureGroup();
        this._tempPoint = L.featureGroup();
        this._tempLine.addTo(this._map);
        this._tempPoint.addTo(this._map);
        this.calculateDistance();
        this._addedLength = this._result.Distance + this._totalLength;
        L.polyline(
          [this.clickedLatLong, this._movingLatLong],
          this.options.lineStyle
        ).addTo(this._tempLine);
        if (this.clickCount > 1) {
          text =
            this.options.lengthUnit.label +
            "</b>&nbsp;" +
            this._addedLength.toFixed(this.options.lengthUnit.decimal) +
            "&nbsp;" +
            this.options.lengthUnit.display +
            '<br><div class="plus-length">(+' +
            this._result.Distance.toFixed(this.options.lengthUnit.decimal) +
            ")</div>";
        } else {
          text =
            this.options.lengthUnit.label +
            "</b>&nbsp;" +
            this._result.Distance.toFixed(this.options.lengthUnit.decimal) +
            "&nbsp;" +
            this.options.lengthUnit.display;
        }
        L.circleMarker(this._movingLatLong, this.options.circleMarker)
          .bindTooltip(text, {
            sticky: true,
            offset: L.point(0, -40),
            className: "moving-tooltip"
          })
          .addTo(this._tempPoint)
          .openTooltip();
      }
    },
    escape: function (e) {
      if (e.keyCode === 27) {
        if (this.clickCount > 0) {
          this._closePath();
        } else {
          this._choice = true;
          this._toggleMeasure();
        }
      }
    },
    calculateDistance: function () {
      let f1 = this.clickedLatLong.lat,
        l1 = this.clickedLatLong.lng,
        f2 = this._movingLatLong.lat,
        l2 = this._movingLatLong.lng;
      let toRadian = Math.PI / 180;
      let R = this.options.lengthUnit.factor
        ? 6371 * this.options.lengthUnit.factor
        : 6371; // kilometres
      let deltaF = (f2 - f1) * toRadian;
      let deltaL = (l2 - l1) * toRadian;
      let a =
        Math.sin(deltaF / 2) * Math.sin(deltaF / 2) +
        Math.cos(f1 * toRadian) *
          Math.cos(f2 * toRadian) *
          Math.sin(deltaL / 2) *
          Math.sin(deltaL / 2);
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      let distance = R * c;
      this._result = {
        Distance: distance
      };
    },
    _closePath: function () {
      this._map.removeLayer(this._tempLine);
      this._map.removeLayer(this._tempPoint);
      if (this.clickCount <= 1) this._map.removeLayer(this._pointLayer);
      this._choice = false;
      L.DomEvent.on(this._container, "click", this._toggleMeasure, this);
      this._toggleMeasure();
    }
  });
  L.control.ruler = function (options) {
    return new L.Control.Ruler(options);
  };
}, window));
